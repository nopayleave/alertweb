// Script to check environment variables
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

console.log('Checking environment variables...');

// Check Firebase config
console.log('Firebase config:');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'Set' : 'Not set');
console.log('FIREBASE_AUTH_DOMAIN:', process.env.FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set');
console.log('FIREBASE_STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not set');
console.log('FIREBASE_MESSAGING_SENDER_ID:', process.env.FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not set');
console.log('FIREBASE_APP_ID:', process.env.FIREBASE_APP_ID ? 'Set' : 'Not set');
console.log('FIREBASE_MEASUREMENT_ID:', process.env.FIREBASE_MEASUREMENT_ID ? 'Set' : 'Not set');

// Check Node environment
console.log('\nNode environment:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'undefined');
console.log('VERCEL:', process.env.VERCEL ? 'Running on Vercel' : 'Not running on Vercel');

console.log('\nCheck complete!'); 