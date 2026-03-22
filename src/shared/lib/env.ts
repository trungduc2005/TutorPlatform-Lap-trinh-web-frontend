const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const wsUrl = import.meta.env.VITE_WS_URL?.trim() || (apiBaseUrl ? `${apiBaseUrl}/ws-chat` : "");
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim() || "";
const firebaseAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || "";
const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || "";
const firebaseStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || "";
const firebaseMessagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim()||"";
const firebaseAppId = import.meta.env.VITE_FIREBASE_APP_ID?.trim() || "";
const firebaseMeasurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || "";

export const env = {
  apiBaseUrl,
  wsUrl,
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  firebaseMeasurementId
};
