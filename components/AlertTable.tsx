
import React from 'react';
import { Alert, AlertAction } from '../types';

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06L9.25 14.388V3.75A.75.75 0 0110 3z"
      clipRule="evenodd"
    />
  </svg>
);


interface AlertTableProps {
  alerts: Alert[];
}

const AlertTable: React.FC<AlertTableProps> = ({ alerts }) => {
  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden border border-overlay">
      <div className="p-4 border-b border-overlay flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Live Alerts Feed</h2>
        <span className="text-xs bg-overlay text-subtle font-mono py-1 px-2 rounded">{alerts.length} alerts</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-overlay text-subtle uppercase text-xs tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Ticker</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold text-right">Price</th>
              <th className="py-3 px-4 font-semibold">Message</th>
              <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-muted">
                  <p className="text-lg font-semibold">Awaiting webhook data...</p>
                  <p className="text-sm mt-1">Use the simulator above to add an alert.</p>
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id} className="border-t border-overlay hover:bg-overlay/50 transition-colors duration-200">
                  <td className="py-3 px-4 font-mono text-white font-bold">{alert.ticker}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-2 font-bold py-1 px-3 rounded-full text-xs ${
                        alert.action === AlertAction.BUY
                          ? 'bg-positive/10 text-positive'
                          : 'bg-negative/10 text-negative'
                      }`}
                    >
                      {alert.action === AlertAction.BUY ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                      <span>{alert.action}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-white text-right">{alert.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                  <td className="py-3 px-4 text-subtle max-w-xs truncate" title={alert.message}>{alert.message}</td>
                  <td className="py-3 px-4 text-right text-subtle font-mono">
                    {alert.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertTable;
