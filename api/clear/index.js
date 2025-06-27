// API endpoint to clear all alerts (for testing purposes)
import { clearAlerts } from '../../firebase/alerts';

// Vercel serverless function handler
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear all alerts from Firebase
    await clearAlerts();
    
    // Return success
    return res.status(200).json({ 
      success: true,
      message: 'All alerts cleared'
    });
  } catch (error) {
    console.error('Error clearing alerts:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to clear alerts' 
    });
  }
} 