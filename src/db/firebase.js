// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS5_ygKcl0umSc2Ew31oKE1L26zTCd9Wk",
  authDomain: "tesupai.firebaseapp.com",
  projectId: "tesupai",
  storageBucket: "tesupai.firebasestorage.app",
  messagingSenderId: "291223011378",
  appId: "1:291223011378:web:f23ad34f5635fce4d37c2b",
  measurementId: "G-EGFLS1Y2FX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app)
// const analytics = getAnalytics(app);
