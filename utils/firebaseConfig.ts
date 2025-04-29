// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from "firebase/auth";


// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8DrsycZiT9aCIjHywGJ0HWXMsKCEvQQE",
  authDomain: "chiatour-ecce5.firebaseapp.com",
  projectId: "chiatour-ecce5",
  storageBucket: "chiatour-ecce5.appspot.com", // <-- aquí también corregido el dominio
  messagingSenderId: "362061962264",
  appId: "1:362061962264:web:29760ae29cd1784b9af76d",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export default app;
const auth = getAuth(app);
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential };
