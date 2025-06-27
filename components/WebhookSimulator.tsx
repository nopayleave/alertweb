import React, { useState } from 'react';
import { Alert, AlertAction } from '../types';

interface WebhookSimulatorProps {
  onNewAlert: (alert: Alert) => void;
}

const WebhookSimulator: React.FC<WebhookSimulatorProps> = ({ onNewAlert }) => {
  const [ticker, setTicker] = useState('BTCUSD');
  const [price, setPrice] = useState('68500.25');
  const [action, setAction] = useState<AlertAction>(AlertAction.BUY);
  const [message, setMessage] = useState('Bullish signal detected');
  const [sending, setSending] = useState(false);
  const [sendingReal, setSendingReal] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAlert: Alert = {
      id: new Date().toISOString() + Math.random(),
      ticker: ticker.toUpperCase(),
      price: parseFloat(price),
      action: action,
      timestamp: new Date(),
      message: message,
    };
    
    onNewAlert(newAlert);
    setResult('Alert simulated successfully!');
    
    // Clear the result message after 3 seconds
    setTimeout(() => {
      setResult(null);
    }, 3000);
  };

  const sendRealWebhook = async () => {
    try {
      setSendingReal(true);
      setResult(null);
      
      const webhookData = {
        symbol: ticker,
        signal: action === AlertAction.BUY ? 'Bullish' : 'Bearish',
        condition: message,
        price: parseFloat(price),
        time: new Date().toISOString()
      };
      
      // Send to the local webhook endpoint
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setResult('Real webhook sent successfully!');
      } else {
        setResult(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending real webhook:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSendingReal(false);
      
      // Clear the result message after 5 seconds
      setTimeout(() => {
        setResult(null);
      }, 5000);
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6 border border-overlay mb-8">
      <h2 className="text-xl font-bold text-white mb-2">Webhook Simulator</h2>
      <p className="text-sm text-subtle mb-6">
        Test the alert system by simulating a webhook from TradingView.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-white mb-1">
              Ticker Symbol
            </label>
            <input
              type="text"
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-white mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              className="w-full bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Action
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value={AlertAction.BUY}
                checked={action === AlertAction.BUY}
                onChange={() => setAction(AlertAction.BUY)}
                className="form-radio text-primary focus:ring-primary"
              />
              <span className="ml-2 text-white">Buy</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value={AlertAction.SELL}
                checked={action === AlertAction.SELL}
                onChange={() => setAction(AlertAction.SELL)}
                className="form-radio text-primary focus:ring-primary"
              />
              <span className="ml-2 text-white">Sell</span>
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
            Alert Message
          </label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            type="submit"
            disabled={sending}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
          >
            {sending ? 'Simulating...' : 'Simulate Alert'}
          </button>
          
          <button
            type="button"
            onClick={sendRealWebhook}
            disabled={sendingReal}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
          >
            {sendingReal ? 'Sending...' : 'Send Real Webhook'}
          </button>
        </div>
      </form>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.includes('Error') ? 'bg-red-500 bg-opacity-20 border border-red-500' : 'bg-green-500 bg-opacity-20 border border-green-500'}`}>
          {result}
        </div>
      )}
    </div>
  );
};

export default WebhookSimulator;