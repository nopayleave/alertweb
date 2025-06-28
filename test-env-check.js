// Test script to check environment variables via the API
// Run with: node test-env-check.js [url]

const url = process.argv[2] || 'http://localhost:5174/api/env-check';
const isLocal = url.includes('localhost');

console.log(`Testing environment variables on ${isLocal ? 'LOCAL' : 'PRODUCTION'} environment`);

async function testEnvCheck() {
  console.log(`Checking environment variables at: ${url}`);
  
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
        console.log('✅ Environment variables check successful!');
        console.log('Environment:', data.environment);
      } else {
        console.error('❌ Environment variables check failed:', data.error);
        console.error('Error details:', data.errorDetails);
      }
    } catch (parseError) {
      console.error('❌ Error parsing JSON response:', parseError);
    }
  } catch (error) {
    console.error('❌ Error checking environment variables:', error);
  }
}

testEnvCheck(); 