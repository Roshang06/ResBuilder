// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);