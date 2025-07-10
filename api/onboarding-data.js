import { initializeDatabase, getOnboardingData, saveOnboardingData } from './db.js';

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
    // Initialize database on first request
    await initializeDatabase();

    if (req.method === 'GET') {
      const { restaurant_id } = req.query;
      const restaurantId = restaurant_id ? parseInt(restaurant_id) : null;
      
      const data = await getOnboardingData(restaurantId);
      res.status(200).json(data);
    } else if (req.method === 'POST') {
      const { teamMembers, lastSaved, restaurant_id } = req.body;
      const restaurantId = restaurant_id ? parseInt(restaurant_id) : null;
      
      const result = await saveOnboardingData(teamMembers, restaurantId);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Data saved successfully',
          timestamp: result.timestamp
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      teamMembers: [],
      lastSaved: null,
      version: '1.0'
    });
  }
} 