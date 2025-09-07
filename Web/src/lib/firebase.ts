// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABKdEkhuIMtIsbk76xk-_uGzysFyRUrPM",
  authDomain: "ticketresell-17dc6.firebaseapp.com",
  projectId: "ticketresell-17dc6",
  storageBucket: "ticketresell-17dc6.appspot.com",
  messagingSenderId: "380237818065",
  appId: "1:380237818065:web:1de3f8e5cfb0d935c17df0",
  measurementId: "G-TRHVT40HHK",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app); // Export the Firebase Auth instance
auth.useDeviceLanguage();
export { auth };
