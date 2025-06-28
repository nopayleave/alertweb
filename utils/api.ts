import { Alert, AlertAction } from '../types';

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
      // In development, always return sample data since we don't have a backend server
      console.log('Development mode: returning sample data');
      
      const sampleAlerts: Alert[] = [
        {
          id: 'sample-1',
          ticker: 'BTCUSD',
          price: 68500.25,
          action: AlertAction.BUY,
          timestamp: new Date(),
          message: 'HA > 0'
        },
        {
          id: 'sample-2',
          ticker: 'ETHUSD',
          price: 3650.45,
          action: AlertAction.SELL,
          timestamp: new Date(Date.now() - 60000 * 5),
          message: 'HA < 0'
        },
        {
          id: 'sample-3',
          ticker: 'AAPL',
          price: 185.25,
          action: AlertAction.BUY,
          timestamp: new Date(Date.now() - 60000 * 10),
          message: 'Breakout above resistance'
        }
      ];
      
      return {
        alerts: sampleAlerts,
        isSampleData: true
      };
    } else {
      // In production, use the API endpoint
      console.log('Fetching alerts from API endpoint');
      const response = await fetch('/api/alerts');
      
      if (!response.ok) {
        console.error(`API request failed with status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('API returned unsuccessful response:', data);
        throw new Error(data.error || 'Failed to fetch alerts');
      }
      
      // Log any warnings from the API
      if (data.error) {
        console.warn('API warning:', data.error);
      }
      
      if (data.message) {
        console.log('API message:', data.message);
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
    
    // Return sample data as fallback
    const fallbackAlerts: Alert[] = [
      {
        id: 'fallback-1',
        ticker: 'BTCUSD',
        price: 68500.25,
        action: AlertAction.BUY,
        timestamp: new Date(),
        message: 'Sample data (connection failed)'
      }
    ];
    
    return {
      alerts: fallbackAlerts,
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