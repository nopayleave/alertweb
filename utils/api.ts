import { Alert, AlertAction } from '../types';

// Function to fetch alerts from our API
export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const response = await fetch('/api/alerts');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch alerts');
    }
    
    return data.data.map((alert: any) => ({
      ...alert,
      // Convert timestamp strings to Date objects
      timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date(),
      createdAt: alert.createdAt ? new Date(alert.createdAt) : new Date(),
      updatedAt: alert.updatedAt ? new Date(alert.updatedAt) : new Date(),
      // Ensure action is of type AlertAction
      action: alert.action === 'BUY' ? AlertAction.BUY : AlertAction.SELL
    }));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
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