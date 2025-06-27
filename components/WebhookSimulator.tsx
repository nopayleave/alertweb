import React, { useState } from 'react';
import { Alert, AlertAction } from '../types';

interface WebhookSimulatorProps {
  onNewAlert: (alert: Alert) => void;
}

const WebhookSimulator: React.FC<WebhookSimulatorProps> = ({ onNewAlert }) => {
  const [ticker, setTicker] = useState('BTCUSD');
  const [price, setPrice] = useState('68500.25');
  const [signal, setSignal] = useState<'Bullish' | 'Bearish'>('Bullish');
  const [condition, setCondition] = useState('HA > 0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !price) return;
    
    const newAlert: Alert = {
      id: new Date().toISOString() + Math.random(),
      ticker: ticker.toUpperCase(),
      price: parseFloat(price),
      action: signal === 'Bullish' ? AlertAction.BUY : AlertAction.SELL,
      timestamp: new Date(),
      message: condition,
    };
    onNewAlert(newAlert);
    
    // Slightly randomize for next submission to make demoing easier
    setPrice((p) => (parseFloat(p) + (Math.random() * 200 - 100)).toFixed(2));
    setSignal(prev => prev === 'Bullish' ? 'Bearish' : 'Bullish');
    setCondition(prev => prev === 'HA > 0' ? 'HA < 0' : 'HA > 0');
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg p-6 border border-overlay mb-8">
      <h2 className="text-xl font-bold text-white mb-2">Webhook Simulator</h2>
      <p className="text-sm text-subtle mb-6">
        This form simulates a POST request from a TradingView webhook. If a ticker already exists, its row is updated; otherwise, a new row is added.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="ticker" className="text-xs font-bold text-subtle mb-1 uppercase tracking-wider">Symbol</label>
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
          <label htmlFor="signal" className="text-xs font-bold text-subtle mb-1 uppercase tracking-wider">Signal</label>
          <select
            id="signal"
            value={signal}
            onChange={(e) => setSignal(e.target.value as 'Bullish' | 'Bearish')}
            className="bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors appearance-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236a6f8f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="Bullish">Bullish</option>
            <option value="Bearish">Bearish</option>
          </select>
        </div>
        <div className="flex flex-col md:col-span-2 lg:col-span-1">
          <label htmlFor="condition" className="text-xs font-bold text-subtle mb-1 uppercase tracking-wider">Condition</label>
          <input
            id="condition"
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="bg-base border border-overlay rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
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