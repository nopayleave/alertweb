// This is a serverless function that will handle incoming webhook requests from TradingView
export default async function handler(req, res) {
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
    // TradingView sends data in a specific format, which we need to parse
    // Example format from TradingView: { "ticker": "BTCUSD", "price": 68500.25, "action": "BUY", "message": "Long signal on 1H chart" }
    
    // You can add additional processing here
    // For example, you could store it in a database, forward it to another service, etc.
    
    // Send a successful response back to TradingView
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook received successfully',
      data: alertData
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to process webhook' 
    });
  }
} 