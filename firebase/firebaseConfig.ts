import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Copia estos valores desde tu consola de Firebase:
// Firebase Console → Project Settings → General → Your apps → SDK setup
const firebaseConfig  = {
   apiKey: "AIzaSyAAjUnzOSFDhOnXd2gQEKKYMQLTXwtLKEs",
  authDomain: "personal-expense-ecb65.firebaseapp.com",
  projectId: "personal-expense-ecb65",
  storageBucket: "personal-expense-ecb65.firebasestorage.app",
  messagingSenderId: "367194377310",
  appId: "1:367194377310:web:1a1fd637379b0e0f3a78cf"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
