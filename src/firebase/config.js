// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyMklpvR11-2nCSWoTopOPs6N38oBr6GY",
  authDomain: "habitvault-f430f.firebaseapp.com",
  projectId: "habitvault-f430f",
  storageBucket: "habitvault-f430f.firebasestorage.app",
  messagingSenderId: "176674261799",
  appId: "1:176674261799:web:e9544fa4d0e148e48eb702",
  measurementId: "G-9WPY1GL1BV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, db, storage, analytics };