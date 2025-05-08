// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential
} from "firebase/auth";

import { getFirestore } from "firebase/firestore"; // <-- IMPORTANTE

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8DrsycZiT9aCIjHywGJ0HWXMsKCEvQQE",
  authDomain: "chiatour-ecce5.firebaseapp.com",
  projectId: "chiatour-ecce5",
  storageBucket: "chiatour-ecce5.appspot.com",
  messagingSenderId: "362061962264",
  appId: "1:362061962264:web:29760ae29cd1784b9af76d",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa servicios
const auth = getAuth(app);
const db = getFirestore(app); // <-- AQUÍ INICIALIZAS FIRESTORE

// Exports
export default app;
export {
  auth,
  db, // <-- EXPORTAS FIRESTORE PARA USARLO EN TU CONTEXTO
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential
};
