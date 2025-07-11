import { initializeDatabase, getOnboardingData, saveOnboardingData } from './db.js';
import { authenticateRequest, addCorsHeaders } from './auth.js';

export default async function handler(req, res) {
  // Add CORS headers
  addCorsHeaders(req, res, () => {});

  // Skip authentication for GET requests (frontend needs to load data)
  if (req.method === 'GET') {
    try {
      await initializeDatabase();
      const { restaurant_id } = req.query;
      const restaurantId = restaurant_id ? parseInt(restaurant_id) : null;
      
      const data = await getOnboardingData(restaurantId);
      res.status(200).json(data);
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({
        error: 'Internal server error',
        teamMembers: [],
        lastSaved: null,
        version: '1.0'
      });
    }
    return;
  }

  // Require authentication for POST requests (saving data)
  if (req.method === 'POST') {
    return authenticateRequest(req, res, async () => {
      try {
        await initializeDatabase();
        const { teamMembers, lastSaved, restaurant_id } = req.body;
        
        // Use user's restaurant ID if they're restricted to one restaurant
        let targetRestaurantId = restaurant_id ? parseInt(restaurant_id) : null;
        if (req.user.access === 'restaurant' && req.user.restaurantId) {
          targetRestaurantId = req.user.restaurantId;
        }
        
        const result = await saveOnboardingData(teamMembers, targetRestaurantId);
        
        if (result.success) {
          res.status(200).json({
            success: true,
            message: 'Data saved successfully',
            timestamp: result.timestamp,
            user: req.user.username,
            access: req.user.access
          });
        } else {
          res.status(500).json({ error: result.error });
        }
      } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
} 