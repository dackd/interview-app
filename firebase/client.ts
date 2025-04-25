import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCjXw-nKIup8M10epSkGMcMhsTcWlFUm4A",
  authDomain: "interview-app-e3ed5.firebaseapp.com",
  projectId: "interview-app-e3ed5",
  storageBucket: "interview-app-e3ed5.firebasestorage.app",
  messagingSenderId: "125782972627",
  appId: "1:125782972627:web:678529817a3c9daea4dc26",
  measurementId: "G-S3PCFFSYJ1",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
