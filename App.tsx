import React, { useState, useCallback, useEffect } from 'react';
import { Alert, AlertAction } from './types';
import AlertTable from './components/AlertTable';
import WebhookSimulator from './components/WebhookSimulator';
import { fetchAlerts, clearAlerts } from './utils/api';

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [clearing, setClearing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSampleData, setIsSampleData] = useState<boolean>(true);

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
      const result = await fetchAlerts();
      
      setAlerts(result.alerts);
      setIsSampleData(result.isSampleData);
    } catch (err) {
      setError('Failed to fetch alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to clear all alerts
  const handleClearAlerts = useCallback(async () => {
    try {
      setClearing(true);
      setError(null);
      const success = await clearAlerts();
      
      if (success) {
        setAlerts([]);
      }
    } catch (err) {
      setError('Failed to clear alerts');
      console.error('Error clearing alerts:', err);
    } finally {
      setClearing(false);
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
            <div className="flex space-x-2">
              <button 
                onClick={loadAlerts}
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh Alerts'}
              </button>
              <button 
                onClick={handleClearAlerts}
                disabled={clearing}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
              >
                {clearing ? 'Clearing...' : 'Clear Alerts'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded mb-4">
              {error}
            </div>
          )}
          
          {isSampleData && (
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 text-white p-4 rounded mb-4">
              <strong>Note:</strong> Displaying sample data. No real alerts have been received yet. Use the webhook simulator below to test or configure TradingView to send real alerts.
            </div>
          )}
          
          {loading && alerts.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-lg p-6 border border-overlay mb-4">
              <p className="text-center text-subtle">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-lg p-6 border border-overlay mb-4">
              <p className="text-center text-subtle">No alerts found. Use the webhook simulator below to create some test alerts.</p>
            </div>
          ) : (
            <AlertTable alerts={alerts} />
          )}
          
          <WebhookSimulator onNewAlert={handleNewAlert} />
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
