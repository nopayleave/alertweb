import { Alert, AlertAction } from '../types';
import { collection, getDocs, query, orderBy, limit, Firestore } from 'firebase/firestore';
import { db } from '../firebase/config.js';

// Declare the ImportMeta interface
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      PROD: boolean;
      MODE: string;
    };
  }
}

// Function to fetch alerts from our API
export async function fetchAlerts(): Promise<{alerts: Alert[], isSampleData: boolean}> {
  try {
    // Check if we're in development mode
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      // In development, fetch directly from Firebase
      console.log('Fetching alerts directly from Firebase (development mode)');
      const alertsQuery = query(
        collection(db as Firestore, 'alerts'),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      
      const querySnapshot = await getDocs(alertsQuery);
      
      if (querySnapshot.empty) {
        console.log('No alerts found in Firebase');
        return {
          alerts: [],
          isSampleData: true
        };
      }
      
      const alerts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ticker: data.ticker || 'UNKNOWN',
          price: data.price || 0,
          action: data.action === 'BUY' ? AlertAction.BUY : AlertAction.SELL,
          timestamp: data.timestamp?.toDate() || new Date(),
          message: data.message || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
      
      console.log(`Fetched ${alerts.length} alerts from Firebase`);
      return {
        alerts,
        isSampleData: false
      };
    } else {
      // In production, use the API endpoint
      console.log('Fetching alerts from API endpoint');
      const response = await fetch('/api/alerts');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to fetch alerts');
      }
      
      const alerts = data.data.map((alert: any) => ({
        ...alert,
        // Convert timestamp strings to Date objects
        timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date(),
        createdAt: alert.createdAt ? new Date(alert.createdAt) : new Date(),
        updatedAt: alert.updatedAt ? new Date(alert.updatedAt) : new Date(),
        // Ensure action is of type AlertAction
        action: alert.action === 'BUY' ? AlertAction.BUY : AlertAction.SELL
      }));
      
      return {
        alerts,
        isSampleData: data.isSampleData || false
      };
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return {
      alerts: [],
      isSampleData: true
    };
  }
}

// Function to format TradingView webhook data into our Alert type
export function formatTradingViewAlert(data: any): Alert | null {
  try {
    // Format from the Pine Script:
    // {"symbol": "BTCUSD", "signal": "Bullish", "condition": "HA > 0", "price": 68500.25, "time": "1234567890"}
    return {
      id: new Date().toISOString() + Math.random(),
      ticker: data.symbol?.toUpperCase() || 'UNKNOWN',
      price: parseFloat(data.price) || 0,
      action: data.signal === 'Bullish' ? AlertAction.BUY : AlertAction.SELL,
      timestamp: new Date(),
      message: data.condition || '',
    };
  } catch (error) {
    console.error('Error formatting TradingView alert:', error);
    return null;
  }
}

// Function to clear all alerts (for testing)
export async function clearAlerts(): Promise<boolean> {
  try {
    const response = await fetch('/api/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to clear alerts');
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing alerts:', error);
    return false;
  }
} 