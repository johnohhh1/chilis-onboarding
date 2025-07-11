import { initializeDatabase, getRestaurantStats, getAllRestaurants } from './db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
      
      if (restaurant_id) {
        // Get stats for specific restaurant
        const stats = await getRestaurantStats(parseInt(restaurant_id));
        res.status(200).json(stats);
      } else {
        // Get stats for all restaurants
        const restaurants = await getAllRestaurants();
        const allStats = [];
        
        for (const restaurant of restaurants) {
          const stats = await getRestaurantStats(restaurant.id);
          allStats.push({
            restaurant_id: restaurant.id,
            restaurant_name: restaurant.name,
            store_number: restaurant.store_number,
            ...stats
          });
        }
        
        res.status(200).json(allStats);
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Restaurant stats API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 