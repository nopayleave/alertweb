// Firebase service for alerts
import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'alerts';

// Add a new alert
export async function addAlert(alert) {
  try {
    console.log('Adding alert to Firebase:', JSON.stringify(alert, null, 2));
    console.log('Using Firebase collection:', COLLECTION_NAME);
    
    // Validate alert data
    if (!alert.ticker) {
      throw new Error('Alert must have a ticker');
    }
    
    if (alert.price === undefined || alert.price === null) {
      throw new Error('Alert must have a price');
    }
    
    if (!alert.action) {
      throw new Error('Alert must have an action');
    }
    
    // Check if we already have an alert for this ticker
    console.log('Checking for existing alerts with ticker:', alert.ticker);
    const existingAlerts = await getAlertsByTicker(alert.ticker);
    
    if (existingAlerts && existingAlerts.length > 0) {
      // Update existing alert
      console.log('Found existing alert, updating:', existingAlerts[0].id);
      const existingAlert = existingAlerts[0];
      const alertRef = doc(db, COLLECTION_NAME, existingAlert.id);
      
      const updateData = {
        ...alert,
        updated: true,
        updatedAt: new Date()
      };
      
      console.log('Updating with data:', JSON.stringify(updateData, null, 2));
      await updateDoc(alertRef, updateData);
      
      const result = {
        ...alert,
        id: existingAlert.id,
        updated: true
      };
      
      console.log('Update successful, returning:', JSON.stringify(result, null, 2));
      return result;
    } else {
      // Add new alert
      console.log('No existing alert found, creating new alert');
      const alertData = {
        ...alert,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Adding document with data:', JSON.stringify(alertData, null, 2));
      const docRef = await addDoc(collection(db, COLLECTION_NAME), alertData);
      
      const result = {
        ...alertData,
        id: docRef.id
      };
      
      console.log('Add successful, returning:', JSON.stringify(result, null, 2));
      return result;
    }
  } catch (error) {
    console.error('Error adding alert:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Get all alerts
export async function getAlerts(limitCount = 100) {
  try {
    const alertsQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(alertsQuery);
    
    const alerts = [];
    querySnapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      });
    });
    
    return alerts;
  } catch (error) {
    console.error('Error getting alerts:', error);
    throw error;
  }
}

// Get alerts by ticker
export async function getAlertsByTicker(ticker) {
  try {
    console.log('Getting alerts by ticker:', ticker);
    
    const alertsQuery = query(
      collection(db, COLLECTION_NAME),
      where('ticker', '==', ticker),
      orderBy('updatedAt', 'desc'),
      limit(1)
    );
    
    console.log('Executing query...');
    const querySnapshot = await getDocs(alertsQuery);
    console.log('Query complete, found', querySnapshot.size, 'documents');
    
    const alerts = [];
    querySnapshot.forEach((doc) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      });
    });
    
    return alerts;
  } catch (error) {
    console.error('Error getting alerts by ticker:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Clear all alerts
export async function clearAlerts() {
  try {
    const alertsQuery = query(
      collection(db, COLLECTION_NAME),
      limit(500)
    );
    
    const querySnapshot = await getDocs(alertsQuery);
    
    const deletePromises = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, COLLECTION_NAME, document.id)));
    });
    
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error clearing alerts:', error);
    throw error;
  }
} 