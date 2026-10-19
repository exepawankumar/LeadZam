const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("../credentials/firebase-service-account.json");

const app = initializeApp({
credential: cert(serviceAccount)
});

const messaging = getMessaging(app);

console.log("Firebase Admin initialized successfully!");

module.exports = {
app,
messaging
};
