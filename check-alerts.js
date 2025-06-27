// Script to check all alerts in Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/config.js';

async function checkAlerts() {
  try {
    console.log('Checking alerts in Firebase...');
    
    const querySnapshot = await getDocs(collection(db, 'alerts'));
    
    console.log(`Found ${querySnapshot.size} alerts in Firebase`);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Alert ID: ${doc.id}`);
      console.log(`  Ticker: ${data.ticker}`);
      console.log(`  Price: ${data.price}`);
      console.log(`  Action: ${data.action}`);
      console.log(`  Message: ${data.message}`);
      console.log(`  Timestamp: ${data.timestamp?.toDate?.() || data.timestamp}`);
      console.log('-------------------');
    });
    
    console.log('✅ Check complete!');
  } catch (error) {
    console.error('❌ Error checking alerts:', error);
  }
}

checkAlerts(); 