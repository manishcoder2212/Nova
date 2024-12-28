//firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyANAnGjKIe2MEQnLl1ELEPXndJoedfTzXo",
  authDomain: "novatracking-ac276.firebaseapp.com",
  databaseURL: "https://novatracking-ac276-default-rtdb.firebaseio.com",
  projectId: "novatracking-ac276",
  storageBucket: "novatracking-ac276.appspot.com",
  messagingSenderId: "307460477155",
  appId: "1:307460477155:web:556cc00292f85008b0b5d6",
  measurementId: "G-9MBEE6ER5M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth, storage };
