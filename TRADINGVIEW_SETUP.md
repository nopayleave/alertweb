# Setting Up TradingView Alerts with Your Webhook

This guide explains how to connect your TradingView alerts to your SimpleHook application.

## Step 1: Get Your Webhook URL

Your webhook URL is automatically displayed in the application. It will look something like:
```
https://your-vercel-deployment-url.vercel.app/api/webhook
```

For example, if your app is deployed at `alertweb-alpha.vercel.app`, your webhook URL would be:
```
https://alertweb-alpha.vercel.app/api/webhook
```

You can copy this URL directly from the application interface.

## Step 2: Create an Alert in TradingView

1. Open TradingView and navigate to the chart with your "Webhook Alert" indicator
2. Click on the "Alerts" button (bell icon) in the right panel
3. Click "Create Alert"
4. Set the condition to use your "Webhook Alert" indicator
5. Choose the "Once Per Bar Close" option

## Step 3: Configure the Webhook

In the alert creation dialog:

1. Scroll down to the "Notifications" section
2. Check the "Webhook URL" option
3. Paste your webhook URL from Step 1
4. Make sure "Alert() function calls only" is selected

Your Pine Script already formats the alert message correctly with this JSON structure:
```json
{
  "symbol": "BTCUSD",
  "signal": "Bullish",
  "condition": "HA > 0",
  "price": 68500.25,
  "time": "1234567890"
}
```

## Step 4: Save Your Alert

Click "Create" to save your alert. Now, whenever your indicator triggers an alert, TradingView will send a webhook to your application with the formatted data.

## Using TradingView Alert Lists

TradingView allows you to create alerts for multiple symbols using alert lists. Here's how to set it up:

1. **Create an Alert List**:
   - Go to the "Alerts" tab in TradingView
   - Click "Create Alert List"
   - Name your list (e.g., "Crypto Watchlist" or "Stock Scanner")
   - Add the symbols you want to monitor

2. **Create Alerts for the List**:
   - Select your alert list
   - Click "Create Alert"
   - Choose your "Webhook Alert" indicator
   - Configure the alert conditions as described above
   - In the "Symbol" dropdown, select "Alert List: [Your List Name]"

3. **Configure Webhook for Each Symbol**:
   - The webhook will be triggered for each symbol in the list that meets your alert conditions
   - Each alert will contain the specific symbol that triggered it

4. **View Alerts in SimpleHook**:
   - Your SimpleHook application will automatically display all alerts received
   - Alerts are grouped by symbol, with the most recent alert for each symbol shown at the top
   - The application refreshes automatically every 30 seconds to show new alerts
   - You can also click the "Refresh Alerts" button to manually update

## Understanding Your Pine Script Alert Messages

Your Pine Script sends two types of alerts:

1. **Bullish Alert**: When Heikin-Ashi value is positive (HA > 0)
   ```json
   {"symbol": "SYMBOL", "signal": "Bullish", "condition": "HA > 0", "price": PRICE, "time": "TIME"}
   ```

2. **Bearish Alert**: When Heikin-Ashi value is negative (HA < 0)
   ```json
   {"symbol": "SYMBOL", "signal": "Bearish", "condition": "HA < 0", "price": PRICE, "time": "TIME"}
   ```

## Testing Your Webhook

You can use the built-in Webhook Simulator in the application to test how alerts will appear without waiting for actual TradingView alerts to trigger.

You can also test your webhook endpoint directly using the following curl command:

```bash
curl -X POST https://your-vercel-deployment-url.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTCUSD", "signal": "Bullish", "condition": "HA > 0", "price": 68500.25, "time": "1234567890"}'
```

## Troubleshooting

If your alerts aren't showing up:

1. Verify your webhook URL is correct
2. Ensure "Alert() function calls only" is selected
3. Check that your Vercel deployment is running properly
4. Look at the Vercel function logs for any errors
5. Check the browser console for any errors

Remember that TradingView free accounts have limitations on the number of alerts you can create. 