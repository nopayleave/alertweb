// API endpoint to test Firebase connectivity
import { adminDb } from '../../firebase/admin-config';

// Vercel serverless function handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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
    console.log('Testing Firebase connectivity...');
    console.log('Environment variables check:');
    console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set');
    console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set');
    console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Set (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'Not set');
    
    // Try to read from the alerts collection
    console.log('Attempting to read from alerts collection...');
    const querySnapshot = await adminDb.collection('alerts').limit(1).get();
    
    console.log(`Successfully read ${querySnapshot.size} documents from alerts collection`);
    
    // Try to write a test document
    console.log('Attempting to write a test document...');
    const testDoc = {
      ticker: 'TEST',
      price: 1234.56,
      action: 'BUY',
      timestamp: new Date(),
      message: 'Firebase connection test',
      isTest: true
    };
    
    const docRef = await adminDb.collection('alerts').add(testDoc);
    console.log('Successfully wrote test document with ID:', docRef.id);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Firebase connection test successful',
      readCount: querySnapshot.size,
      writeId: docRef.id,
      firebaseConfig: {
        projectId: process.env.FIREBASE_PROJECT_ID || 'default-project-id',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set',
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    console.error('Error testing Firebase connectivity:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to test Firebase connectivity',
      errorDetails: error.message,
      firebaseConfig: {
        projectId: process.env.FIREBASE_PROJECT_ID || 'default-project-id',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set',
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Not set'
      }
    });
  }
} 