import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAAjUnzOSFDhOnXd2gQEKKYMQLTXwtLKEs",
  authDomain: "personal-expense-ecb65.firebaseapp.com",
  projectId: "personal-expense-ecb65",
  storageBucket: "personal-expense-ecb65.firebasestorage.app",
  messagingSenderId: "367194377310",
  appId: "1:367194377310:web:1a1fd637379b0e0f3a78cf"
};

const isNewApp = getApps().length === 0;
const app = isNewApp ? initializeApp(firebaseConfig) : getApp();

export const auth = isNewApp
  ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(app);

export const db = getFirestore(app);
