module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Username, X-Password');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('Basic test API called:', req.method);

  return res.status(200).json({
    message: 'Basic test API working',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}; 