// Simple in-memory store for alerts
// In a production environment, you would use a database instead

// In-memory storage for alerts
let alerts = [];

// Add a new alert to the store
export function addAlert(alert) {
  // Check if we already have an alert for this ticker
  const existingIndex = alerts.findIndex(a => a.ticker === alert.ticker);
  
  if (existingIndex !== -1) {
    // Update existing alert
    const existing = alerts[existingIndex];
    alerts[existingIndex] = {
      ...alert,
      id: existing.id, // Keep the same ID
      updated: true
    };
  } else {
    // Add new alert
    alerts.unshift(alert); // Add to beginning of array
  }
  
  // Limit to 100 alerts
  if (alerts.length > 100) {
    alerts = alerts.slice(0, 100);
  }
  
  return alerts;
}

// Get all alerts
export function getAlerts() {
  return alerts;
}

// Clear all alerts (for testing)
export function clearAlerts() {
  alerts = [];
  return alerts;
} 