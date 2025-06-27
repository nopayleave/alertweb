// Script to add a realistic alert directly to Firebase
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase/config.js';

async function addRealAlert() {
  try {
    console.log('Adding realistic alert to Firebase...');
    
    const alertData = {
      ticker: 'BTCUSD',
      price: 65432.10,
      action: 'BUY',
      timestamp: new Date(),
      message: 'Bullish breakout on 4H chart',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'alerts'), alertData);
    console.log('Successfully added alert with ID:', docRef.id);
    
    // Add a second alert for another ticker
    const alertData2 = {
      ticker: 'ETHUSD',
      price: 3456.78,
      action: 'SELL',
      timestamp: new Date(),
      message: 'Bearish divergence on RSI',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef2 = await addDoc(collection(db, 'alerts'), alertData2);
    console.log('Successfully added second alert with ID:', docRef2.id);
    
    console.log('✅ Real alerts added successfully!');
  } catch (error) {
    console.error('❌ Error adding real alerts:', error);
  }
}

addRealAlert(); 