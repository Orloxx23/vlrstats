// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "valorant-stats-43c1a.firebaseapp.com",
  projectId: "valorant-stats-43c1a",
  storageBucket: "valorant-stats-43c1a.appspot.com",
  messagingSenderId: "679214425482",
  appId: "1:679214425482:web:94c959e368dec8c340d473",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
