const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

let db;

try {
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    console.log("Initializing Firebase Admin with GOOGLE_CREDENTIALS_JSON...");

    const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(
        "✅ Firebase Admin SDK initialized successfully with env JSON."
      );
    }
  } else if (process.env.FIREBASE_PRIVATE_KEY) {
    console.log("Initializing Firebase Admin with separate env variables...");

    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(
        "✅ Firebase Admin SDK initialized successfully with separate env vars."
      );
    }
  } else {
    throw new Error("No Firebase credentials found in environment variables");
  }

  db = admin.firestore();
  console.log("✅ Firestore instance created successfully");
} catch (error) {
  console.error("❌ FATAL: Failed to initialize Firebase Admin SDK:", error);
  process.exit(1);
}

module.exports = { db };
