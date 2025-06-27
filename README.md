# TradingView Live Alerts Dashboard

A real-time dashboard that displays alerts from TradingView via webhooks.

## Features

- Receive real-time alerts from TradingView via webhooks
- Display alerts in a clean, modern interface
- Test alerts using the built-in webhook simulator
- Automatically updates when new alerts arrive
- Stores alerts in Firebase for persistence

## Firebase Setup

This application uses Firebase Firestore to store alerts. To set it up:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Create a Firestore database in your project
3. Go to Project Settings > General > Your apps > Web app
4. Register a new web app if you haven't already
5. Copy the Firebase configuration values
6. Create a `.env.local` file in the root of your project with the following:

```
# Firebase configuration
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
```

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
3. Add the Firebase environment variables in the Vercel project settings
4. Deploy with default settings
5. Use the deployed URL as your TradingView webhook endpoint

## TradingView Integration

See [TRADINGVIEW_SETUP.md](TRADINGVIEW_SETUP.md) for detailed instructions on how to set up TradingView alerts with your webhook URL.

## API Endpoints

The application includes several API endpoints:

- `/api/webhook` - Receives alerts from TradingView
- `/api/alerts` - Returns all stored alerts
- `/api/clear` - Clears all alerts (for testing)

## Technology Stack

- React
- TypeScript
- Vite
- Firebase Firestore
- Vercel Serverless Functions
