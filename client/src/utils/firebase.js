import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const rawApiKey = import.meta.env.VITE_FIREBASE_APIKEY || "";
// Consider it configured ONLY if it is not empty and is not the placeholder string
const isKeyConfigured = rawApiKey && rawApiKey !== "" && !rawApiKey.includes("YOUR_FIREBASE_");

const firebaseConfig = {
  apiKey: isKeyConfigured ? rawApiKey : "",
  authDomain: "hirex-acbb0.firebaseapp.com",
  projectId: "hirex-acbb0",
  storageBucket: "hirex-acbb0.firebasestorage.app",
  messagingSenderId: "1006430387342",
  appId: "1:1006430387342:web:f9f94b994925a417ea9ddf"
};

let app;
let auth;
let provider;

if (isKeyConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("VITE_FIREBASE_APIKEY is not configured in client/.env. Firebase Auth is disabled, mock login will be active.");
}

export { auth, provider };
