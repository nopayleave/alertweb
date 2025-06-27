import React, { useState, useCallback, useEffect } from 'react';
import { Alert, AlertAction } from './types';
import AlertTable from './components/AlertTable';
import WebhookSimulator from './components/WebhookSimulator';
import { fetchAlerts } from './utils/api';

const initialAlerts: Alert[] = [
  {
    id: 'initial-2',
    ticker: 'ETHUSD',
    price: 3650.45,
    action: AlertAction.SELL,
    timestamp: new Date(Date.now() - 60000 * 5),
    message: 'Bearish divergence on 4H MACD',
  },
  {
    id: 'initial-1',
    ticker: 'BTCUSD',
    price: 67100.00,
    action: AlertAction.BUY,
    timestamp: new Date(Date.now() - 60000 * 10),
    message: 'Breakout above resistance confirmed',
  },
];

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to get the current URL for the webhook
  useEffect(() => {
    // Get the base URL of the deployed application
    const baseUrl = window.location.origin;
    // Set the webhook URL to the API endpoint
    setWebhookUrl(`${baseUrl}/api/webhook`);
  }, []);

  // Function to fetch alerts from the API
  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAlerts = await fetchAlerts();
      
      if (fetchedAlerts.length > 0) {
        setAlerts(fetchedAlerts);
      }
    } catch (err) {
      setError('Failed to fetch alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch alerts when the component mounts
  useEffect(() => {
    loadAlerts();
    
    // Set up polling to fetch alerts every 30 seconds
    const intervalId = setInterval(loadAlerts, 30000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [loadAlerts]);

  const handleNewAlert = useCallback((newAlert: Alert) => {
    setAlerts(prevAlerts => {
      const existingAlertIndex = prevAlerts.findIndex(a => a.ticker === newAlert.ticker);

      if (existingAlertIndex !== -1) {
        // Update existing alert and move to top
        const updatedAlerts = [...prevAlerts];
        const existingAlert = updatedAlerts.splice(existingAlertIndex, 1)[0];
        const updatedItem = {
          ...existingAlert,
          price: newAlert.price,
          action: newAlert.action,
          timestamp: newAlert.timestamp,
          message: newAlert.message,
          updated: true,
        };
        return [updatedItem, ...updatedAlerts];
      } else {
        // Add new alert to top
        const newAlertWithFlag = { ...newAlert, updated: true };
        return [newAlertWithFlag, ...prevAlerts].slice(0, 100);
      }
    });
  }, []);

  useEffect(() => {
    // This effect handles the removal of the 'updated' flag after the animation.
    const hasUpdatedAlerts = alerts.some(alert => alert.updated);
    if (hasUpdatedAlerts) {
      const timer = setTimeout(() => {
        setAlerts(currentAlerts =>
          currentAlerts.map(alert =>
            alert.updated ? { ...alert, updated: false } : alert
          )
        );
      }, 1500); // Should match animation duration in index.html
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-2">
                TradingView Live Alerts
            </h1>
            <p className="text-lg text-muted">
                Displaying real-time TradingView alerts received via webhook.
            </p>
        </header>
        
        <main>
          {/* Display the webhook URL for TradingView integration */}
          <div className="bg-surface rounded-lg shadow-lg p-6 border border-overlay mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Webhook URL</h2>
            <p className="text-sm text-subtle mb-6">
              Sends a POST request to your specified URL when your alert triggers.
            </p>
            <div className="relative">
              <input
                type="text"
                value={webhookUrl}
                readOnly
                className="w-full bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors pr-10"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                  alert('Webhook URL copied to clipboard!');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-subtle hover:text-white"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
            {!webhookUrl && <p className="text-red-500 mt-2">A Webhook URL is required</p>}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Live Alerts</h2>
            <button 
              onClick={loadAlerts}
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Alerts'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded mb-4">
              {error}
            </div>
          )}
          
          <WebhookSimulator onNewAlert={handleNewAlert} />
          <AlertTable alerts={alerts} />
        </main>

        <footer className="text-center mt-12 text-subtle text-xs">
          <p>&copy; {new Date().getFullYear()} Live Alert Dashboard. All rights reserved.</p>
          <p className="mt-1">Configure your TradingView alerts to send webhooks to the URL above.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
