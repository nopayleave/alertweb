import React, { useState } from 'react';
import { Alert, AlertAction } from '../types';

interface WebhookSimulatorProps {
  onNewAlert: (alert: Alert) => void;
}

const WebhookSimulator: React.FC<WebhookSimulatorProps> = ({ onNewAlert }) => {
  const [ticker, setTicker] = useState('BTCUSD');
  const [price, setPrice] = useState('68500.25');
  const [action, setAction] = useState<AlertAction>(AlertAction.BUY);
  const [message, setMessage] = useState('Long signal on 1H chart, RSI crossover');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !price) return;
    
    const newAlert: Alert = {
      id: new Date().toISOString() + Math.random(),
      ticker: ticker.toUpperCase(),
      price: parseFloat(price),
      action,
      timestamp: new Date(),
      message,
    };
    onNewAlert(newAlert);
    
    // Slightly randomize for next submission to make demoing easier
    setPrice((p) => (parseFloat(p) + (Math.random() * 200 - 100)).toFixed(2));
    setAction(prev => prev === AlertAction.BUY ? AlertAction.SELL : AlertAction.BUY);
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6 border border-overlay mb-8">
      <h2 className="text-xl font-bold text-white mb-2">Webhook Simulator</h2>
      <p className="text-sm text-subtle mb-6">
        This form simulates a POST request from a TradingView webhook. If a ticker already exists, its row is updated; otherwise, a new row is added.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="ticker" className="text-xs font-bold text-subtle mb-1 uppercase tracking-wider">Ticker</label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="price" className="text-xs font-bold text-subtle mb-1 uppercase tracking-wider">Price</label>
          <input
            id="price"
            type="number"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="action" className="text-xs font-bold text-subtle mb-1 uppercase tracking-wider">Action</label>
          <select
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value as AlertAction)}
            className="bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236a6f8f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value={AlertAction.BUY}>BUY</option>
            <option value={AlertAction.SELL}>SELL</option>
          </select>
        </div>
        <div className="flex flex-col md:col-span-2 lg:col-span-1">
          <label htmlFor="message" className="text-xs font-bold text-subtle mb-1 uppercase tracking-wider">Message</label>
          <input
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="e.g. {{plot_0}}"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Send Mock Webhook
        </button>
      </form>
    </div>
  );
};

export default WebhookSimulator;