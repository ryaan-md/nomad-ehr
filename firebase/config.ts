import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByB0akkcWlqol9uS23nSUjFQ8H8_xPeko",
  authDomain: "nomad-ehr.firebaseapp.com",
  projectId: "nomad-ehr",
  storageBucket: "nomad-ehr.firebasestorage.app",
  messagingSenderId: "1059369727092",
  appId: "1:1059369727092:web:ff6c4fea7c89620c298d21",
  measurementId: "G-WWD56QB546"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;

