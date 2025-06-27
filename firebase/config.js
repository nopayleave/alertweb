// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyD-axuwiqJYkBCHO7l2s9RH2YVfbtJtrS4",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "alertwebdb.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "alertwebdb",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "alertwebdb.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "121983308277",
  appId: process.env.FIREBASE_APP_ID || "1:121983308277:web:b84b0bbb13e34f6a3c90bc",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-7J5B5FCKFX"
};

// Initialize Firebase
let app;
let db;
let analytics;

// Check if Firebase is already initialized
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Initialize analytics only in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db, analytics }; 