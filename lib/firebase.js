import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcL9z6tchcQPLCGWQZd3ttchUgTjXGci4",
  authDomain: "yt-download-ccc1f.firebaseapp.com",
  projectId: "yt-download-ccc1f",
  storageBucket: "yt-download-ccc1f.firebasestorage.app",
  messagingSenderId: "612366962219",
  appId: "1:612366962219:web:4db8fda704c374594ba46e",
  measurementId: "G-3TR7ETELWZ"
};

let app;
let auth;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Initialize analytics only if available
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { app, auth, db, analytics };
