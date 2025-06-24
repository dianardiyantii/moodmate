import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-tx2kByyRmKUvVGBOlrXH10haGF2wks8",
  authDomain: "moodmate-3b031.firebaseapp.com",
  projectId: "moodmate-3b031",
  storageBucket: "moodmate-3b031.firebasestorage.app",
  messagingSenderId: "9453526697",
  appId: "1:9453526697:web:eb078c4f76e4b78eec93b8",
  measurementId: "G-38EE5QHQZB",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { 
  db, 
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
};