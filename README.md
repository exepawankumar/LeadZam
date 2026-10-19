# LeadZam — Click-to-Call CRM

LeadZam is an Android Developer Intern assessment project that connects a CRM dashboard to an Android phone using a Node.js backend and Firebase Cloud Messaging (FCM).

A CRM user clicks **Notify Phone** for a lead. The dashboard sends a request to the backend, the backend sends an FCM message, and the Android app receives it. When the phone user taps the notification/action, the Android dialer opens with the lead's number prefilled. **The user places the call manually; the app must never call automatically.**

## Architecture

```text
React + Vite CRM Dashboard
          |
          | HTTP API request
          v
Node.js + Express Backend
          |
          | Firebase Admin SDK
          v
Firebase Cloud Messaging (FCM)
          |
          | Push/data message
          v
Android App (Kotlin + Jetpack Compose)
          |
          | User taps notification/action
          v
Android Dialer (number prefilled)
```

- **CRM dashboard:** Displays leads and lets the user request a notification.
- **Backend:** Validates requests and sends FCM messages.
- **FCM:** Delivers the message to the target Android device.
- **Android app:** Receives the message and lets the user open the dialer.

The dashboard must communicate with the backend—not directly with Firebase Admin. Firebase Admin credentials must never be placed in the dashboard or Android app.

## Technology stack

| Part | Technology |
|---|---|
| CRM dashboard | React, Vite, JavaScript, CSS |
| Backend API | Node.js, Express.js |
| Push messaging | Firebase Admin SDK, Firebase Cloud Messaging |
| Android client | Kotlin, Jetpack Compose, Firebase Messaging |

## Project structure

```text
LeadZam/
├── crm-dashboard/       # React + Vite CRM website
├── backend/             # Node.js + Express API
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── android-app/         # Android application (folder name may vary)
├── README.md
└── .gitignore
```

The Android folder may still be named `app/` in the current Android Studio project. Keep the actual folder name used by your repository; do not rename it just to match this example.

## Run locally

### 1. Start the backend

Open a terminal in the `backend` folder:

```powershell
cd "D:\Android Project\LeadZam\backend"
npm install
```

Keep the Firebase service-account JSON outside the repository, for example:

```text
%USERPROFILE%\LeadZam-Secrets\serviceAccountKey.json
```

Set the credential path in the current PowerShell terminal:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "$HOME\LeadZam-Secrets\serviceAccountKey.json"
```

Start the server:

```powershell
node server.js
```

The dashboard code currently expects the backend at `http://localhost:5000` and checks `GET /health`. Open `http://localhost:5000/health` in a browser to verify the health endpoint if the backend implements it. A successful health check only confirms that the API responds; it does not prove FCM delivery works.

### 2. Start the CRM dashboard

Open another terminal in the dashboard folder:

```powershell
cd "D:\Android Project\LeadZam\crm-dashboard"
npm install
npm run dev
```

Use the local URL printed by Vite in the terminal. The dashboard is configured to call:

- `GET http://localhost:5000/health` — checks backend availability.
- `POST http://localhost:5000/api/notifications/send` — requests a notification for a lead.

The notification request in the current prototype includes `fcmToken`, `leadId`, `leadName`, and `phoneNumber`. Confirm that the backend expects these exact fields before testing.

### 3. Run the Android app

Open the Android project in Android Studio, confirm Firebase Messaging is configured for the same Firebase project as the backend, and run the app on a device. Verify that it can receive the message and that tapping the notification opens the dialer with the number filled in.

## Current status

Based on the latest project notes:

- React + Vite dashboard has been created and runs in VS Code.
- Backend folder and dependencies have been created.
- Android FCM token retrieval has worked.
- The dashboard includes a backend status check every five seconds.
- The immediate backend issue was that `node server.js` exited without showing output.
- Full dashboard → backend → FCM → Android → dialer integration still needs to be tested.

Check the actual code before assuming any endpoint or feature is fully working. In particular, the dashboard's `/health` and `/api/notifications/send` routes must match the backend implementation.

## Security

- Never commit Firebase service-account credentials, private keys, `.env` secrets, or real FCM tokens.
- Keep `serviceAccountKey.json` outside the repository and add secret patterns to `.gitignore`.
- The FCM token was previously placed in frontend code during local testing. Use a refreshed token and **do not commit or deploy a real token in React**. A frontend bundle is visible to users.
- The current browser-supplied token approach is only a prototype. A safer design registers the Android device token with the backend and keeps device-token management server-side.
- Before public deployment, add authentication, authorization, input validation, rate limiting, and HTTPS.
- The backend should only send call notifications to authorized users/devices.
- The Android app must not place calls automatically. The user must tap and initiate the call.

## Project goal

LeadZam demonstrates how a web frontend, a Node.js API, Firebase Cloud Messaging, and an Android app can work together in a click-to-call workflow. It is a learning prototype and is not production-ready until security controls and end-to-end testing are complete.
