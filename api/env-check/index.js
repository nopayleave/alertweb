// API endpoint to check environment variables
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not set',
      VERCEL: process.env.VERCEL ? 'Set' : 'Not set',
      
      // Firebase config
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 
        `Set (length: ${process.env.FIREBASE_PRIVATE_KEY.length})` : 'Not set',
      
      // Other Firebase config
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'Set' : 'Not set',
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set',
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not set',
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not set',
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ? 'Set' : 'Not set',
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID ? 'Set' : 'Not set'
    };
    
    return res.status(200).json({
      success: true,
      message: 'Environment variables check',
      environment: envVars
    });
  } catch (error) {
    console.error('Error checking environment variables:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to check environment variables',
      errorDetails: error.message
    });
  }
} 