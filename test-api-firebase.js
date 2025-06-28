// Test script to check Firebase connectivity via the API
// Run with: node test-api-firebase.js [url]
// Examples:
// - Local: node test-api-firebase.js http://localhost:5174/api/test
// - Vercel: node test-api-firebase.js https://your-vercel-app.vercel.app/api/test

// Default to local if no URL provided
const url = process.argv[2] || 'http://localhost:5174/api/test';
const isLocal = url.includes('localhost');

console.log(`Testing Firebase via API on ${isLocal ? 'LOCAL' : 'PRODUCTION'} environment`);

async function testApiFirebase() {
  console.log(`Testing Firebase connectivity via API at: ${url}`);
  
  try {
    const response = await fetch(url);
    
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
        console.log('✅ Firebase connectivity test successful!');
        console.log('Read count:', data.readCount);
        console.log('Write ID:', data.writeId);
        console.log('Firebase config:', data.firebaseConfig);
      } else {
        console.error('❌ Firebase connectivity test failed:', data.error);
        console.error('Error details:', data.errorDetails);
        console.error('Firebase config:', data.firebaseConfig);
      }
    } catch (parseError) {
      console.error('❌ Error parsing JSON response:', parseError);
    }
  } catch (error) {
    console.error('❌ Error testing Firebase connectivity:', error);
    console.error('\nPossible issues:');
    console.error('1. API server is not running (if testing locally)');
    console.error('2. Vercel deployment is not complete or has errors');
    console.error('3. Firebase configuration is incorrect in the environment');
    console.error('4. Network connectivity issues');
    console.error('5. Firebase security rules are preventing access');
  }
}

testApiFirebase(); 