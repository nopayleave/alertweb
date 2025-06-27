// API endpoint to fetch alerts
import { getAlerts } from './store';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all alerts from the store
    const alerts = getAlerts();
    
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