// Test script to send a webhook request to the API
// Run with: node test-webhook.js [url]

const url = process.argv[2] || 'http://localhost:3000/api/webhook';

async function testWebhook() {
  console.log(`Testing webhook at: ${url}`);
  
  const testData = {
    symbol: "BTCUSD",
    signal: "Bullish",
    condition: "HA > 0",
    price: 68500.25,
    time: new Date().toISOString()
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testWebhook(); 