// API endpoint to test Firebase connectivity
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

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
    
    // Try to read from the alerts collection
    console.log('Attempting to read from alerts collection...');
    const alertsQuery = query(collection(db, 'alerts'), limit(1));
    const querySnapshot = await getDocs(alertsQuery);
    
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
    
    const docRef = await addDoc(collection(db, 'alerts'), testDoc);
    console.log('Successfully wrote test document with ID:', docRef.id);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Firebase connection test successful',
      readCount: querySnapshot.size,
      writeId: docRef.id,
      firebaseConfig: {
        projectId: process.env.FIREBASE_PROJECT_ID || 'default-project-id',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'default-storage-bucket'
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
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'default-storage-bucket'
      }
    });
  }
} 