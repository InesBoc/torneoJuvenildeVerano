import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2uW3EU1AN1BriEduAebEax8QzCOOfpx8",
  authDomain: "torneo-juvenil-de-carnaval.firebaseapp.com",
  projectId: "torneo-juvenil-de-carnaval",
  storageBucket: "torneo-juvenil-de-carnaval.firebasestorage.app",
  messagingSenderId: "165597080687",
  appId: "1:165597080687:web:d60f9dc7bb0c331a5ab19a",
  measurementId: "G-9V5X305JPJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);