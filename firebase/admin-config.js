// Firebase Admin SDK configuration for serverless functions
import admin from 'firebase-admin';
import fs from 'fs';

// Initialize Firebase Admin
let adminApp;
let adminDb;

try {
  // Check if the app has already been initialized
  if (admin.apps.length) {
    adminApp = admin.app();
    adminDb = admin.firestore();
    console.log('Using existing Firebase Admin app');
  } else {
    // Initialize a new app
    console.log('Initializing new Firebase Admin app');
    
    let credential;
    
    // First try to get credentials from environment variables (for Vercel)
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_CLIENT_EMAIL && 
        process.env.FIREBASE_PRIVATE_KEY) {
      console.log('Using Firebase credentials from environment variables');
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace newlines in the private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      });
    } else {
      // Try to load from service account file (for local development)
      try {
        console.log('Trying to load Firebase credentials from service-account.json');
        const serviceAccount = JSON.parse(fs.readFileSync('service-account.json', 'utf8'));
        credential = admin.credential.cert(serviceAccount);
      } catch (fileError) {
        console.error('Error loading service account file:', fileError);
        throw new Error('Firebase Admin credentials not available');
      }
    }
    
    adminApp = admin.initializeApp({
      credential: credential,
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || "alertwebdb"}.firebaseio.com`
    });
    
    adminDb = admin.firestore();
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

export { adminApp, adminDb }; 