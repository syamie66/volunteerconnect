// firebase.js (FINAL VERSION WITH YOUR CONFIG)

// Import Firebase v9 modular SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (from your message)
const firebaseConfig = {
  apiKey: "AIzaSyAQr_P1HlrIsK3YWY--d3u4L95jCptez0w",
  authDomain: "volunteerconnect-fc3f3.firebaseapp.com",
  projectId: "volunteerconnect-fc3f3",
  storageBucket: "volunteerconnect-fc3f3.firebasestorage.app",
  messagingSenderId: "741658710490",
  appId: "1:741658710490:web:b5f49f9e56d5fb5115b0e3",
  measurementId: "G-SN729TVHFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// If you want analytics, only works on HTTPS/production
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);
