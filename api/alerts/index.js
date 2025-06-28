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

  // Sample data to return when Firebase is unavailable
  const sampleAlerts = [
    {
      id: 'sample-1',
      ticker: 'BTCUSD',
      price: 68500.25,
      action: 'BUY',
      timestamp: new Date(),
      message: 'HA > 0',
      isSampleData: true
    },
    {
      id: 'sample-2',
      ticker: 'ETHUSD',
      price: 3650.45,
      action: 'SELL',
      timestamp: new Date(Date.now() - 60000 * 5),
      message: 'HA < 0',
      isSampleData: true
    },
    {
      id: 'sample-3',
      ticker: 'AAPL',
      price: 185.25,
      action: 'BUY',
      timestamp: new Date(Date.now() - 60000 * 10),
      message: 'Breakout above resistance',
      isSampleData: true
    }
  ];

  try {
    console.log('Fetching alerts from Firebase...');
    
    // Get all alerts from Firebase
    const alerts = await getAlerts();
    
    console.log(`Retrieved ${alerts ? alerts.length : 0} alerts from Firebase`);
    
    // If no alerts, return sample data
    if (!alerts || alerts.length === 0) {
      console.log('No alerts found, returning sample data');
      
      return res.status(200).json({ 
        success: true,
        data: sampleAlerts,
        isSampleData: true,
        message: 'No real alerts found. Displaying sample data.'
      });
    }
    
    // Return the real alerts
    return res.status(200).json({ 
      success: true,
      data: alerts,
      isSampleData: false,
      message: `Retrieved ${alerts.length} real alerts from Firebase.`
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    console.error('Error details:', error.message);
    
    // Instead of returning 500, return sample data with a warning
    console.log('Firebase connection failed, returning sample data as fallback');
    
    return res.status(200).json({ 
      success: true,
      data: sampleAlerts,
      isSampleData: true,
      error: 'Firebase connection failed',
      errorDetails: error.toString(),
      message: 'Using sample data due to Firebase connection issues.'
    });
  }
} 