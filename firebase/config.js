// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-axuwiqJYkBCHO7l2s9RH2YVfbtJtrS4",
  authDomain: "alertwebdb.firebaseapp.com",
  projectId: "alertwebdb",
  storageBucket: "alertwebdb.appspot.com",
  messagingSenderId: "121983308277",
  appId: "1:121983308277:web:b84b0bbb13e34f6a3c90bc",
  measurementId: "G-7J5B5FCKFX"
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