// Script to help set up Firebase configuration
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome to the Firebase setup script!');
console.log('This script will help you set up your Firebase configuration.');
console.log('Please enter your Firebase configuration details:');

const config = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

rl.question('Firebase API Key: ', (apiKey) => {
  config.apiKey = apiKey;
  
  rl.question('Firebase Auth Domain: ', (authDomain) => {
    config.authDomain = authDomain;
    
    rl.question('Firebase Project ID: ', (projectId) => {
      config.projectId = projectId;
      
      rl.question('Firebase Storage Bucket: ', (storageBucket) => {
        config.storageBucket = storageBucket;
        
        rl.question('Firebase Messaging Sender ID: ', (messagingSenderId) => {
          config.messagingSenderId = messagingSenderId;
          
          rl.question('Firebase App ID: ', (appId) => {
            config.appId = appId;
            
            // Create .env.local file
            const envContent = `# Firebase configuration
FIREBASE_API_KEY=${config.apiKey}
FIREBASE_AUTH_DOMAIN=${config.authDomain}
FIREBASE_PROJECT_ID=${config.projectId}
FIREBASE_STORAGE_BUCKET=${config.storageBucket}
FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
FIREBASE_APP_ID=${config.appId}`;
            
            fs.writeFile('.env.local', envContent, (err) => {
              if (err) {
                console.error('Error writing .env.local file:', err);
              } else {
                console.log('.env.local file created successfully!');
              }
              
              // Update firebase/config.js file
              const configContent = `// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}"
};

// Initialize Firebase
let app;
let db;

// Check if Firebase is already initialized
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db };`;
              
              fs.writeFile('firebase/config.js', configContent, (err) => {
                if (err) {
                  console.error('Error writing firebase/config.js file:', err);
                } else {
                  console.log('firebase/config.js file updated successfully!');
                }
                
                console.log('\nFirebase setup complete!');
                console.log('You can now run your application with:');
                console.log('npm run dev');
                
                rl.close();
              });
            });
          });
        });
      });
    });
  });
}); 