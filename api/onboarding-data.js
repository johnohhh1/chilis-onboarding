import { initializeDatabase, getOnboardingData, saveOnboardingData } from './db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Username, X-Password');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Init DB
    await initializeDatabase();

    // Parse credentials
    const inputUser = req.headers['x-username'];
    const inputPass = req.headers['x-password'];
    const isTest = req.body?.test === true;

    // Basic auth map (replace later with Neon table)
    const validUsers = {
      'admin': 'letmein',
      'john': 'manager2025',
      'brinker': 'teamchilis'
    };

    // Reject unless test mode or valid creds
    if (!isTest && (!validUsers[inputUser] || validUsers[inputUser] !== inputPass)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Handle GET request
    if (req.method === 'GET') {
      const { restaurant_id } = req.query;
      const restaurantId = restaurant_id ? parseInt(restaurant_id) : null;

      const data = await getOnboardingData(restaurantId);
      return res.status(200).json(data);
    }

    // Handle POST request (including test ping from LoginModal)
    if (req.method === 'POST') {
      if (isTest) {
        return res.status(200).json({
          success: true,
          access: inputUser === 'admin' ? 'admin' : 'restaurant',
          message: 'Login verified (test mode)'
        });
      }

      const { teamMembers, restaurant_id } = req.body;
      const restaurantId = restaurant_id ? parseInt(restaurant_id) : null;

      const result = await saveOnboardingData(teamMembers, restaurantId);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: 'Data saved successfully',
          timestamp: result.timestamp,
          access: inputUser === 'admin' ? 'admin' : 'restaurant'
        });
      } else {
        return res.status(500).json({ error: result.error });
      }
    }

    // Fallback for unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      teamMembers: [],
      lastSaved: null,
      version: '1.0'
    });
  }
}
