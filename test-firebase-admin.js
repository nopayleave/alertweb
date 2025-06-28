// Test script to check Firebase Admin SDK connection
// Run with: node test-firebase-admin.js

import * as admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check for service account credentials
let serviceAccount;
try {
  // First try to read from environment variables
  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      process.env.FIREBASE_PRIVATE_KEY) {
    console.log('Using Firebase credentials from environment variables');
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
  } else {
    // Fallback to service account file
    console.log('Using Firebase credentials from service-account.json');
    serviceAccount = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));
  }
} catch (error) {
  console.error('Error loading service account:', error);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  process.exit(1);
}

// Test Firestore connection
async function testFirestoreConnection() {
  const db = admin.firestore();
  
  try {
    console.log('Testing Firestore connection...');
    
    // Try to read from the alerts collection
    console.log('Attempting to read from alerts collection...');
    const querySnapshot = await db.collection('alerts').limit(3).get();
    
    console.log(`Successfully read ${querySnapshot.size} documents from alerts collection`);
    
    // Print the first few documents
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < 3) {
        console.log(`Document ${doc.id}:`, doc.data());
        count++;
      }
    });
    
    // Try to write a test document
    console.log('\nAttempting to write a test document...');
    const testDoc = {
      ticker: 'TEST_ADMIN',
      price: 1234.56,
      action: 'BUY',
      timestamp: new Date(),
      message: 'Firebase Admin SDK connection test',
      isTest: true
    };
    
    const docRef = await db.collection('alerts').add(testDoc);
    console.log('Successfully wrote test document with ID:', docRef.id);
    
    console.log('\n✅ Firebase Admin SDK connection test successful!');
  } catch (error) {
    console.error('\n❌ Firebase Admin SDK connection test failed:', error);
    console.error('\nPossible issues:');
    console.error('1. Service account credentials are incorrect');
    console.error('2. Firebase project does not exist');
    console.error('3. Firebase rules are preventing read/write access');
    console.error('4. Network connectivity issues');
  }
}

testFirestoreConnection(); 