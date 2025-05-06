// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/utils/firebaseConfig"; // Asegúrate de que la ruta sea correcta
import { setDoc, doc, getDoc } from "firebase/firestore"; // Importar funciones necesarias de Firestore

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Creamos el contexto de autenticación
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
  expoPushToken,
}: {
  children: React.ReactNode;
  expoPushToken: string;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Observador de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar el suscriptor cuando el componente se desmonte
  }, []);

// Función de login
const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const uid = user.uid;

  if (expoPushToken) {
    await setDoc(doc(db, "users", uid), {
      userId: uid,
      name: email.split("@")[0],
      email: email,
      expoPushToken,
    }, { merge: true }); // merge:true para no borrar datos previos
  }
  await syncPushTokenIfNeeded(uid); // Sincronizar el token si es necesario
};
// Función de registro
const register = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const uid = user.uid;

  if (expoPushToken) {
    await setDoc(doc(db, "users", uid), {
      userId: uid,
      name: email.split("@")[0],
      email: email,
      expoPushToken,
    });
  }
  await syncPushTokenIfNeeded(uid); // Sincronizar el token si es necesario
};

  // Función de logout
  const logout = async () => {
    await signOut(auth);
  };
  const syncPushTokenIfNeeded = async (uid: string) => {
    if (!expoPushToken) return;
  
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
  
    const currentTokenInDB = userSnapshot.exists() ? userSnapshot.data().expoPushToken : null;
  
    if (currentTokenInDB !== expoPushToken) {
      await setDoc(userDocRef, {
        expoPushToken,
      }, { merge: true });
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
};
