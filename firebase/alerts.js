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
    // Check if we already have an alert for this ticker
    const existingAlerts = await getAlertsByTicker(alert.ticker);
    
    if (existingAlerts && existingAlerts.length > 0) {
      // Update existing alert
      const existingAlert = existingAlerts[0];
      const alertRef = doc(db, COLLECTION_NAME, existingAlert.id);
      
      await updateDoc(alertRef, {
        ...alert,
        updated: true,
        updatedAt: new Date()
      });
      
      return {
        ...alert,
        id: existingAlert.id,
        updated: true
      };
    } else {
      // Add new alert
      const alertData = {
        ...alert,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), alertData);
      
      return {
        ...alertData,
        id: docRef.id
      };
    }
  } catch (error) {
    console.error('Error adding alert:', error);
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
    const alertsQuery = query(
      collection(db, COLLECTION_NAME),
      where('ticker', '==', ticker),
      orderBy('updatedAt', 'desc'),
      limit(1)
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
    console.error('Error getting alerts by ticker:', error);
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