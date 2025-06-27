# Setting Up TradingView Alerts with Your Webhook

This guide explains how to connect your TradingView alerts to your SimpleHook application.

## Step 1: Get Your Webhook URL

Your webhook URL is automatically displayed in the application. It will look something like:
```
https://your-vercel-deployment-url.vercel.app/api/webhook
```

You can copy this URL directly from the application interface.

## Step 2: Create an Alert in TradingView

1. Open TradingView and navigate to the chart you want to set an alert on
2. Click on the "Alerts" button (bell icon) in the right panel
3. Click "Create Alert"
4. Configure your alert conditions (price, indicator, etc.)

## Step 3: Configure the Webhook

In the alert creation dialog:

1. Scroll down to the "Notifications" section
2. Check the "Webhook URL" option
3. Paste your webhook URL from Step 1
4. In the "Message" field, format your alert data as JSON:

```json
{
  "ticker": "{{ticker}}",
  "price": {{close}},
  "action": "BUY",
  "message": "Your alert message here"
}
```

You can customize this JSON with any TradingView variables:
- `{{ticker}}` - The symbol name
- `{{close}}` - The current price
- `{{volume}}` - The current volume
- `{{time}}` - The current bar time
- `{{timenow}}` - The current time
- `{{plot_0}}`, `{{plot_1}}`, etc. - Values from your indicators

For the "action" field, you can use "BUY" or "SELL" based on your alert condition.

## Step 4: Save Your Alert

Click "Create" to save your alert. Now, whenever this alert triggers, TradingView will send a webhook to your application with the formatted data.

## Testing Your Webhook

You can use the built-in Webhook Simulator in the application to test how alerts will appear without waiting for actual TradingView alerts to trigger.

## Troubleshooting

If your alerts aren't showing up:

1. Verify your webhook URL is correct
2. Check that your JSON format in the TradingView message field is valid
3. Make sure your Vercel deployment is running properly
4. Check the browser console for any errors

Remember that TradingView free accounts have limitations on the number of alerts you can create. 