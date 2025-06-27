// Simple in-memory store for alerts
// In a production environment, you would use a database instead

// NOTE: This is a simple in-memory store that will reset whenever the serverless function is redeployed
// or when the instance is recycled. For production use, you should use a database.

// Using global to persist data across function invocations in Vercel
let globalAlerts = global.alerts || [];
global.alerts = globalAlerts;

// Add a new alert to the store
export function addAlert(alert) {
  // Check if we already have an alert for this ticker
  const existingIndex = globalAlerts.findIndex(a => a.ticker === alert.ticker);
  
  if (existingIndex !== -1) {
    // Update existing alert
    const existing = globalAlerts[existingIndex];
    globalAlerts[existingIndex] = {
      ...alert,
      id: existing.id, // Keep the same ID
      updated: true
    };
  } else {
    // Add new alert
    globalAlerts.unshift(alert); // Add to beginning of array
  }
  
  // Limit to 100 alerts
  if (globalAlerts.length > 100) {
    globalAlerts = globalAlerts.slice(0, 100);
  }
  
  // Update the global reference
  global.alerts = globalAlerts;
  
  return globalAlerts;
}

// Get all alerts
export function getAlerts() {
  return globalAlerts;
}

// Clear all alerts (for testing)
export function clearAlerts() {
  globalAlerts = [];
  global.alerts = globalAlerts;
  return globalAlerts;
} 