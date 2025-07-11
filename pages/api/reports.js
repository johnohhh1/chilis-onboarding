import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { type, applicant_id } = req.query;

    switch (type) {
      case 'applicant_summary':
        // Get detailed summary for specific applicant
        if (!applicant_id) {
          res.status(400).json({ message: 'applicant_id is required' });
          return;
        }

        const summary = await sql`
          SELECT 
            a.*,
            COUNT(CASE WHEN ap.status = 'completed' THEN 1 END) as completed_steps,
            COUNT(ap.id) as total_steps,
            ROUND(
              (COUNT(CASE WHEN ap.status = 'completed' THEN 1 END)::float / COUNT(ap.id)::float) * 100, 2
            ) as completion_percentage
          FROM applicants a
          LEFT JOIN applicant_progress ap ON a.id = ap.applicant_id
          WHERE a.id = ${applicant_id}
          GROUP BY a.id
        `;

        const progressDetails = await sql`
          SELECT 
            ap.status,
            os.step_name,
            os.description,
            oc.name as category_name,
            ap.started_at,
            ap.completed_at,
            ap.notes,
            ap.completed_by
          FROM applicant_progress ap
          JOIN onboarding_steps os ON ap.step_id = os.id
          JOIN onboarding_categories oc ON os.category_id = oc.id
          WHERE ap.applicant_id = ${applicant_id}
          ORDER BY oc.order_index, os.order_index
        `;

        res.status(200).json({
          summary: summary[0],
          progress: progressDetails
        });
        break;

      case 'all_applicants':
        // Get summary for all applicants
        const allApplicants = await sql`
          SELECT 
            a.*,
            COUNT(CASE WHEN ap.status = 'completed' THEN 1 END) as completed_steps,
            COUNT(ap.id) as total_steps,
            ROUND(
              (COUNT(CASE WHEN ap.status = 'completed' THEN 1 END)::float / COUNT(ap.id)::float) * 100, 2
            ) as completion_percentage,
            COUNT(CASE WHEN ap.status = 'in_progress' THEN 1 END) as in_progress_steps,
            COUNT(CASE WHEN ap.status = 'pending' THEN 1 END) as pending_steps
          FROM applicants a
          LEFT JOIN applicant_progress ap ON a.id = ap.applicant_id
          GROUP BY a.id
          ORDER BY a.created_at DESC
        `;

        res.status(200).json(allApplicants);
        break;

      case 'category_summary':
        // Get summary by category for specific applicant
        if (!applicant_id) {
          res.status(400).json({ message: 'applicant_id is required' });
          return;
        }

        const categorySummary = await sql`
          SELECT 
            oc.name as category_name,
            oc.order_index as category_order,
            COUNT(ap.id) as total_steps,
            COUNT(CASE WHEN ap.status = 'completed' THEN 1 END) as completed_steps,
            COUNT(CASE WHEN ap.status = 'in_progress' THEN 1 END) as in_progress_steps,
            COUNT(CASE WHEN ap.status = 'pending' THEN 1 END) as pending_steps,
            ROUND(
              (COUNT(CASE WHEN ap.status = 'completed' THEN 1 END)::float / COUNT(ap.id)::float) * 100, 2
            ) as completion_percentage
          FROM onboarding_categories oc
          LEFT JOIN onboarding_steps os ON oc.id = os.category_id
          LEFT JOIN applicant_progress ap ON os.id = ap.step_id AND ap.applicant_id = ${applicant_id}
          WHERE oc.is_active = true
          GROUP BY oc.id, oc.name, oc.order_index
          ORDER BY oc.order_index
        `;

        res.status(200).json(categorySummary);
        break;

      case 'pending_steps':
        // Get all pending steps for specific applicant
        if (!applicant_id) {
          res.status(400).json({ message: 'applicant_id is required' });
          return;
        }

        const pendingSteps = await sql`
          SELECT 
            os.step_name,
            os.description,
            os.estimated_time_minutes,
            oc.name as category_name,
            oc.order_index as category_order,
            os.order_index as step_order
          FROM applicant_progress ap
          JOIN onboarding_steps os ON ap.step_id = os.id
          JOIN onboarding_categories oc ON os.category_id = oc.id
          WHERE ap.applicant_id = ${applicant_id} AND ap.status = 'pending'
          ORDER BY oc.order_index, os.order_index
        `;

        res.status(200).json(pendingSteps);
        break;

      default:
        res.status(400).json({ message: 'Invalid report type' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 