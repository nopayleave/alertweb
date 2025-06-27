// API endpoint to fetch alerts
import { getAlerts } from '../../firebase/alerts';

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

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all alerts from Firebase
    const alerts = await getAlerts();
    
    // If no alerts, return sample data
    if (!alerts || alerts.length === 0) {
      const sampleAlerts = [
        {
          id: 'sample-1',
          ticker: 'BTCUSD',
          price: 68500.25,
          action: 'BUY',
          timestamp: new Date(),
          message: 'HA > 0',
        },
        {
          id: 'sample-2',
          ticker: 'ETHUSD',
          price: 3650.45,
          action: 'SELL',
          timestamp: new Date(Date.now() - 60000 * 5),
          message: 'HA < 0',
        }
      ];
      
      return res.status(200).json({ 
        success: true,
        data: sampleAlerts
      });
    }
    
    // Return the alerts
    return res.status(200).json({ 
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch alerts' 
    });
  }
} 