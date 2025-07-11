export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Username, X-Password');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('Simple test API called:', req.method);

  if (req.method === 'POST') {
    const inputUser = req.headers['x-username'];
    const inputPass = req.headers['x-password'];
    const isTest = req.body?.test === true;

    console.log('Simple test - credentials:', { inputUser, hasPassword: !!inputPass, isTest });

    if (isTest) {
      return res.status(200).json({
        success: true,
        message: 'Simple test API working',
        user: inputUser
      });
    }
  }

  return res.status(200).json({
    message: 'Simple test API working',
    method: req.method
  });
} 