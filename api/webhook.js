// This is a serverless function that will handle incoming webhook requests from TradingView
import { addAlert } from './store';

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
    // Parse the incoming webhook data
    const alertData = req.body;
    
    // Log the received data (for debugging)
    console.log('Received TradingView alert:', alertData);
    
    // Process the TradingView alert data
    // Format from the Pine Script:
    // {"symbol": "BTCUSD", "signal": "Bullish", "condition": "HA > 0", "price": 68500.25, "time": "1234567890"}
    
    // Convert the alert data to our application format
    const processedAlert = {
      id: new Date().toISOString() + Math.random(),
      ticker: alertData.symbol?.toUpperCase() || 'UNKNOWN',
      price: parseFloat(alertData.price) || 0,
      action: alertData.signal === 'Bullish' ? 'BUY' : 'SELL',
      timestamp: new Date(),
      message: alertData.condition || '',
    };
    
    console.log('Processed alert:', processedAlert);
    
    // Store the alert
    addAlert(processedAlert);
    
    // Send a successful response back to TradingView
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully',
      data: processedAlert
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process webhook' 
    });
  }
} 