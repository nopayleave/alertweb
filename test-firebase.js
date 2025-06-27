// Test script to check Firebase connection
// Run with: node test-firebase.js

import { db } from './firebase/config.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';

async function testFirebaseConnection() {
  console.log('Testing Firebase connection...');
  
  try {
    // Try to read from the alerts collection
    console.log('Attempting to read from alerts collection...');
    const querySnapshot = await getDocs(collection(db, 'alerts'));
    
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
      ticker: 'TEST',
      price: 1234.56,
      action: 'BUY',
      timestamp: new Date(),
      message: 'Firebase connection test',
      isTest: true
    };
    
    const docRef = await addDoc(collection(db, 'alerts'), testDoc);
    console.log('Successfully wrote test document with ID:', docRef.id);
    
    console.log('\n✅ Firebase connection test successful!');
  } catch (error) {
    console.error('\n❌ Firebase connection test failed:', error);
    console.error('\nPossible issues:');
    console.error('1. Firebase configuration is incorrect');
    console.error('2. Firebase project does not exist');
    console.error('3. Firebase rules are preventing read/write access');
    console.error('4. Network connectivity issues');
  }
}

testFirebaseConnection(); 