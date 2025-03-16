// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCdz7fetGqvDU9vU4hQIgKNUMJa2xYowhA",
  authDomain: "resume-builder-7f5c5.firebaseapp.com",
  projectId: "resume-builder-7f5c5",
  storageBucket: "resume-builder-7f5c5.firebasestorage.app",
  messagingSenderId: "80773765331",
  appId: "1:80773765331:web:8cd72bb79e7219ab2edc26",
  measurementId: "G-WMKDYXV10V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);
export default app;
