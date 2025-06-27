import { Alert, AlertAction } from '../types';

// Function to fetch alerts from our API
export async function fetchAlerts(): Promise<Alert[]> {
  try {
    // In a real implementation, you would fetch from your API
    // For now, we'll return an empty array as this would be populated by real data
    // from the webhook endpoint
    return [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

// Function to format TradingView webhook data into our Alert type
export function formatTradingViewAlert(data: any): Alert | null {
  try {
    // TradingView sends data in various formats depending on how you set it up
    // This is a basic example - you'll need to adjust based on your actual TradingView alert message format
    return {
      id: new Date().toISOString() + Math.random(),
      ticker: data.ticker?.toUpperCase() || 'UNKNOWN',
      price: parseFloat(data.price) || 0,
      action: data.action === 'BUY' ? AlertAction.BUY : AlertAction.SELL,
      timestamp: new Date(),
      message: data.message || '',
    };
  } catch (error) {
    console.error('Error formatting TradingView alert:', error);
    return null;
  }
} 