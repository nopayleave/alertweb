// Firebase Admin service for alerts
import { adminDb } from './admin-config';

const COLLECTION_NAME = 'alerts';

// Add a new alert
export async function addAlert(alert) {
  try {
    console.log('Adding alert to Firebase (Admin):', JSON.stringify(alert, null, 2));
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
      
      const updateData = {
        ...alert,
        updated: true,
        updatedAt: new Date()
      };
      
      console.log('Updating with data:', JSON.stringify(updateData, null, 2));
      await adminDb.collection(COLLECTION_NAME).doc(existingAlert.id).update(updateData);
      
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
      const docRef = await adminDb.collection(COLLECTION_NAME).add(alertData);
      
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
    const querySnapshot = await adminDb.collection(COLLECTION_NAME)
      .orderBy('updatedAt', 'desc')
      .limit(limitCount)
      .get();
    
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
    
    const querySnapshot = await adminDb.collection(COLLECTION_NAME)
      .where('ticker', '==', ticker)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();
    
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
    const querySnapshot = await adminDb.collection(COLLECTION_NAME)
      .limit(500)
      .get();
    
    const batch = adminDb.batch();
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    return true;
  } catch (error) {
    console.error('Error clearing alerts:', error);
    throw error;
  }
} 