// This is a serverless function that will handle incoming webhook requests from TradingView
import { addAlert } from '../../firebase/admin-alerts';

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
    console.log('Webhook request received');
    
    // Parse the incoming webhook data
    const alertData = req.body;
    
    // Log the received data (for debugging)
    console.log('Received TradingView alert:', JSON.stringify(alertData, null, 2));
    console.log('Environment variables check:');
    console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set');
    console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set');
    console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Set (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'Not set');
    
    // Validate required fields
    if (!alertData.symbol) {
      console.error('Missing required field: symbol');
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field: symbol' 
      });
    }
    
    if (!alertData.price) {
      console.error('Missing required field: price');
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field: price' 
      });
    }
    
    if (!alertData.signal) {
      console.error('Missing required field: signal');
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field: signal' 
      });
    }
    
    // Process the TradingView alert data
    // Format from the Pine Script:
    // {"symbol": "BTCUSD", "signal": "Bullish", "condition": "HA > 0", "price": 68500.25, "time": "1234567890"}
    
    console.log('Processing alert data...');
    
    // Convert the alert data to our application format
    const processedAlert = {
      ticker: alertData.symbol?.toUpperCase() || 'UNKNOWN',
      price: parseFloat(alertData.price) || 0,
      action: alertData.signal === 'Bullish' ? 'BUY' : 'SELL',
      timestamp: new Date(),
      message: alertData.condition || '',
    };
    
    console.log('Processed alert:', JSON.stringify(processedAlert, null, 2));
    console.log('Storing alert in Firebase...');
    
    // Store the alert in Firebase
    const savedAlert = await addAlert(processedAlert);
    
    console.log('Alert stored successfully:', JSON.stringify(savedAlert, null, 2));
    
    // Send a successful response back to TradingView
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully',
      data: savedAlert
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process webhook',
      errorDetails: error.message
    });
  }
} 