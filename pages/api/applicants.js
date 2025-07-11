import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all applicants or specific applicant
        const { id } = req.query;
        if (id) {
          const applicant = await sql`
            SELECT * FROM applicants WHERE id = ${id}
          `;
          res.status(200).json(applicant[0] || null);
        } else {
          const applicants = await sql`
            SELECT * FROM applicants ORDER BY created_at DESC
          `;
          res.status(200).json(applicants);
        }
        break;

      case 'POST':
        // Create new applicant
        const { first_name, last_name, email, phone, position, restaurant_location, hire_date } = req.body;
        const newApplicant = await sql`
          INSERT INTO applicants (first_name, last_name, email, phone, position, restaurant_location, hire_date)
          VALUES (${first_name}, ${last_name}, ${email}, ${phone}, ${position}, ${restaurant_location}, ${hire_date})
          RETURNING *
        `;
        
        // Initialize progress for all steps
        const steps = await sql`SELECT id FROM onboarding_steps WHERE is_active = true ORDER BY order_index`;
        for (const step of steps) {
          await sql`
            INSERT INTO applicant_progress (applicant_id, step_id, status)
            VALUES (${newApplicant[0].id}, ${step.id}, 'pending')
          `;
        }
        
        res.status(201).json(newApplicant[0]);
        break;

      case 'PUT':
        // Update applicant
        const { id: updateId, ...updateData } = req.body;
        const updatedApplicant = await sql`
          UPDATE applicants 
          SET first_name = ${updateData.first_name}, 
              last_name = ${updateData.last_name}, 
              email = ${updateData.email}, 
              phone = ${updateData.phone}, 
              position = ${updateData.position}, 
              restaurant_location = ${updateData.restaurant_location}, 
              hire_date = ${updateData.hire_date},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${updateId}
          RETURNING *
        `;
        res.status(200).json(updatedApplicant[0]);
        break;

      case 'DELETE':
        // Delete applicant
        const { id: deleteId } = req.query;
        await sql`DELETE FROM applicants WHERE id = ${deleteId}`;
        res.status(200).json({ message: 'Applicant deleted successfully' });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 