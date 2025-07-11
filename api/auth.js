// Authentication middleware for team access with multiple users
export function authenticateRequest(req, res, next) {
  // Check for credentials in headers or query params
  const username = req.headers['x-username'] || req.query.username;
  const password = req.headers['x-password'] || req.query.password;
  
  // User credentials (in production, use environment variables)
  const USERS = {
    'Chilis605': {
      password: '3940Baldwin$$',
      access: 'restaurant',
      restaurantId: 1 // Only see their restaurant
    },
    'ChilisAdmin': {
      password: '3940Baldwin$$',
      access: 'admin',
      restaurantId: null // Can see all restaurants
    }
  };
  
  const user = USERS[username];
  
  if (user && user.password === password) {
    // Add user info to request for use in API routes
    req.user = {
      username,
      access: user.access,
      restaurantId: user.restaurantId
    };
    return next();
  }
  
  // If no authentication provided, return 401
  res.status(401).json({
    error: 'Authentication required',
    message: 'Please provide valid username and password'
  });
}

// Middleware to add CORS headers
export function addCorsHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Username, X-Password');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
} 