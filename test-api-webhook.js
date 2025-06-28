// Test script to send a webhook request directly to the API
// Run with: node test-api-webhook.js [url]
// Examples:
// - Local: node test-api-webhook.js http://localhost:5174/api/webhook
// - Vercel: node test-api-webhook.js https://your-vercel-app.vercel.app/api/webhook

// Default to local if no URL provided
const url = process.argv[2] || 'http://localhost:5174/api/webhook';
const isLocal = url.includes('localhost');

console.log(`Testing webhook API on ${isLocal ? 'LOCAL' : 'PRODUCTION'} environment`);

async function testApiWebhook() {
  console.log(`Testing API webhook at: ${url}`);
  
  // Generate random price to make it more realistic
  const randomPrice = Math.floor(Math.random() * 1000) + 60000;
  
  const testData = {
    symbol: "BTCUSD",
    signal: "Bullish",
    condition: "HA > 0",
    price: randomPrice,
    time: new Date().toISOString()
  };
  
  try {
    console.log('Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!response.ok) {
      console.error('Error response:', responseText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    try {
      const data = JSON.parse(responseText);
      console.log('Response JSON:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('✅ Webhook test successful!');
        console.log('Alert saved with ID:', data.data?.id);
      } else {
        console.error('❌ Webhook test failed:', data.error);
      }
    } catch (parseError) {
      console.error('❌ Error parsing JSON response:', parseError);
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error);
    console.error('\nPossible issues:');
    console.error('1. API server is not running (if testing locally)');
    console.error('2. Vercel deployment is not complete or has errors');
    console.error('3. Firebase configuration is incorrect in the environment');
    console.error('4. Network connectivity issues');
  }
}

testApiWebhook(); 