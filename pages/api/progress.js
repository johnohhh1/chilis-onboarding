import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get progress for specific applicant
        const { applicant_id } = req.query;
        if (applicant_id) {
          const progress = await sql`
            SELECT 
              ap.id,
              ap.applicant_id,
              ap.step_id,
              ap.status,
              ap.started_at,
              ap.completed_at,
              ap.notes,
              ap.completed_by,
              os.step_name,
              os.description,
              os.order_index,
              os.is_required,
              os.estimated_time_minutes,
              oc.name as category_name,
              oc.order_index as category_order
            FROM applicant_progress ap
            JOIN onboarding_steps os ON ap.step_id = os.id
            JOIN onboarding_categories oc ON os.category_id = oc.id
            WHERE ap.applicant_id = ${applicant_id}
            ORDER BY oc.order_index, os.order_index
          `;
          res.status(200).json(progress);
        } else {
          res.status(400).json({ message: 'applicant_id is required' });
        }
        break;

      case 'POST':
        // Update progress for a step
        const { applicant_id, step_id, status, notes, completed_by } = req.body;
        
        const updateData = {
          status,
          updated_at: new Date()
        };

        if (status === 'in_progress' && !req.body.started_at) {
          updateData.started_at = new Date();
        } else if (status === 'completed' && !req.body.completed_at) {
          updateData.completed_at = new Date();
        }

        if (notes) updateData.notes = notes;
        if (completed_by) updateData.completed_by = completed_by;

        const updatedProgress = await sql`
          UPDATE applicant_progress 
          SET ${sql(updateData)}
          WHERE applicant_id = ${applicant_id} AND step_id = ${step_id}
          RETURNING *
        `;
        
        res.status(200).json(updatedProgress[0]);
        break;

      case 'PUT':
        // Bulk update progress
        const { applicant_id: bulkApplicantId, progress_updates } = req.body;
        
        for (const update of progress_updates) {
          const { step_id, status, notes, completed_by } = update;
          
          const updateData = {
            status,
            updated_at: new Date()
          };

          if (status === 'in_progress') {
            updateData.started_at = new Date();
          } else if (status === 'completed') {
            updateData.completed_at = new Date();
          }

          if (notes) updateData.notes = notes;
          if (completed_by) updateData.completed_by = completed_by;

          await sql`
            UPDATE applicant_progress 
            SET ${sql(updateData)}
            WHERE applicant_id = ${bulkApplicantId} AND step_id = ${step_id}
          `;
        }
        
        res.status(200).json({ message: 'Progress updated successfully' });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 