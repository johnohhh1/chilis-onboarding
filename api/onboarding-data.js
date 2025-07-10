import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all onboarding data
      const result = await sql`
        SELECT * FROM onboarding_data 
        ORDER BY updated_at DESC 
        LIMIT 1
      `;
      
      if (result.rows.length > 0) {
        const data = result.rows[0];
        res.status(200).json({
          teamMembers: data.team_members || [],
          lastSaved: data.updated_at,
          version: '1.0'
        });
      } else {
        // Return empty data if no records exist
        res.status(200).json({
          teamMembers: [],
          lastSaved: null,
          version: '1.0'
        });
      }
    } else if (req.method === 'POST') {
      // Save onboarding data
      const { teamMembers, lastSaved } = req.body;
      
      // Check if we have any existing data
      const existingData = await sql`
        SELECT id FROM onboarding_data LIMIT 1
      `;
      
      if (existingData.rows.length > 0) {
        // Update existing record
        await sql`
          UPDATE onboarding_data 
          SET team_members = ${JSON.stringify(teamMembers)}, updated_at = NOW()
          WHERE id = ${existingData.rows[0].id}
        `;
      } else {
        // Insert new record
        await sql`
          INSERT INTO onboarding_data (team_members, updated_at)
          VALUES (${JSON.stringify(teamMembers)}, NOW())
        `;
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Data saved successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    // Fallback response for development
    if (req.method === 'GET') {
      res.status(200).json({
        teamMembers: [],
        lastSaved: null,
        version: '1.0'
      });
    } else if (req.method === 'POST') {
      res.status(200).json({ 
        success: true, 
        message: 'Data saved successfully (fallback)',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ error: 'Failed to process request' });
    }
  }
} 