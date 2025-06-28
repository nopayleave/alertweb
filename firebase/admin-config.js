// Firebase Admin SDK configuration for serverless functions
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
let adminApp;
let adminDb;

try {
  // Check if the app has already been initialized
  adminApp = admin.apps.length 
    ? admin.app() 
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID || "alertwebdb",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace newlines in the private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || "alertwebdb"}.firebaseio.com`
      });
  
  adminDb = admin.firestore();
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

export { adminApp, adminDb }; 