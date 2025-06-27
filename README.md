# TradingView Live Alerts Dashboard

A real-time dashboard that displays alerts from TradingView via webhooks.

## Features

- Receive real-time alerts from TradingView via webhooks
- Display alerts in a clean, modern interface
- Test alerts using the built-in webhook simulator
- Automatically updates when new alerts arrive

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```

2. Run the app:
   ```
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deploy to Vercel

1. Push this repository to GitHub
2. Import the repository in Vercel
3. Deploy with default settings
4. Use the deployed URL as your TradingView webhook endpoint

## TradingView Integration

See [TRADINGVIEW_SETUP.md](TRADINGVIEW_SETUP.md) for detailed instructions on how to set up TradingView alerts with your webhook URL.

## API Endpoint

The application includes a serverless API endpoint at `/api/webhook` that receives alerts from TradingView and displays them in the dashboard.

## Technology Stack

- React
- TypeScript
- Vite
- Vercel Serverless Functions
