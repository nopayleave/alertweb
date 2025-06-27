// API root endpoint
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return API information
  return res.status(200).json({
    name: 'SimpleHook API',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/webhook',
        method: 'POST',
        description: 'Endpoint for TradingView webhooks'
      },
      {
        path: '/api/alerts',
        method: 'GET',
        description: 'Endpoint to fetch all alerts'
      }
    ]
  });
} 