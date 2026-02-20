import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAZRRQ1Rd3wx3SyxKQmhnjCR0b81SAi_JA",
  authDomain: "notesaura-programming-guide.firebaseapp.com",
  projectId: "notesaura-programming-guide",
  storageBucket: "notesaura-programming-guide.firebasestorage.app",
  messagingSenderId: "311926717488",
  appId: "1:311926717488:android:1ad0bbe8c00649a1fe41f5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
