import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('API called:', req.method, req.url);
    
    // Get session using NextAuth
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      console.log('No session found');
      return res.status(401).json({ error: 'Unauthorized - Please sign in' });
    }

    console.log('Session found for user:', session.user.username);

    // Handle GET request
    if (req.method === 'GET') {
      console.log('Handling GET request');
      return res.status(200).json({
        teamMembers: [],
        lastSaved: null,
        version: '1.0',
        restaurantId: null
      });
    }

    // Handle POST request
    if (req.method === 'POST') {
      console.log('Handling POST request');
      
      console.log('Saving data (mock)');
      return res.status(200).json({
        success: true,
        message: 'Data saved successfully (mock)',
        timestamp: new Date().toISOString(),
        access: session.user.access
      });
    }

    // Fallback for unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      teamMembers: [],
      lastSaved: null,
      version: '1.0'
    });
  }
}
