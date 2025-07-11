import { initializeDatabase, getAllRestaurants, createRestaurant, getRestaurantStats } from './db.js';

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
      const restaurants = await getAllRestaurants();
      res.status(200).json(restaurants);
    } else if (req.method === 'POST') {
      const restaurantData = req.body;
      
      // Validate required fields
      if (!restaurantData.name || !restaurantData.store_number) {
        return res.status(400).json({ 
          error: 'Restaurant name and store number are required' 
        });
      }

      const newRestaurant = await createRestaurant(restaurantData);
      res.status(201).json(newRestaurant);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Restaurants API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 