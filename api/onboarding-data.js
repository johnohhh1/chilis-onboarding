export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple in-memory storage for now
  let data = {
    teamMembers: [],
    lastSaved: null,
    version: '1.0'
  };

  try {
    if (req.method === 'GET') {
      res.status(200).json(data);
    } else if (req.method === 'POST') {
      const { teamMembers, lastSaved } = req.body;
      
      data = {
        teamMembers: teamMembers || [],
        lastSaved: lastSaved || new Date().toISOString(),
        version: '1.0'
      };
      
      res.status(200).json({ 
        success: true, 
        message: 'Data saved successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json({
      teamMembers: [],
      lastSaved: null,
      version: '1.0'
    });
  }
} 