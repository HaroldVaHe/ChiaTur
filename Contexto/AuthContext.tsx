// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { auth, db } from "@/utils/firebaseConfig"; // Asegúrate de que la ruta sea correcta
import { setDoc, doc, getDoc } from "firebase/firestore"; // Importar funciones necesarias de Firestore
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";


interface AuthContextType {
  user: User | null;
  loading: boolean;
  authLoading: boolean; // Add this line
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  isNewUser: boolean; // Added to match the provider value
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>; // Added to match the provider value
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
  const [authLoading, setAuthLoading] = useState(false); // Carga para login/register
  const [isNewUser, setIsNewUser] = useState(false);

  
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
    // Cargar el usuario desde AsyncStorage al iniciar
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch {
          await AsyncStorage.removeItem("user"); // por si está dañado
        }
      }
    };
    loadUserFromStorage();
  }, []);
  // Observador de autenticación
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      await AsyncStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      setUser(null);
      await AsyncStorage.removeItem("user");
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, []);


// Función de login
const login = async (email: string, password: string) => {
  setAuthLoading(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;
    

    if (expoPushToken) {
      await setDoc(doc(db, "users", uid), {
        userId: uid,
        name: email.split("@")[0],
        email: email,
        expoPushToken,
      }, { merge: true });
    }

    await syncPushTokenIfNeeded(uid);
    await AsyncStorage.setItem("user", JSON.stringify(user));

  } finally {
    setAuthLoading(false);
  }
};
// Función de registro
const register = async (email: string, password: string):Promise<UserCredential> => {
  setAuthLoading(true);
  try {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const uid = user.uid;
      setIsNewUser(true);


  if (expoPushToken) {
    await setDoc(doc(db, "users", uid), {
      userId: uid,
      name: email.split("@")[0],
      email: email,
      expoPushToken,
    });
  }
  await syncPushTokenIfNeeded(uid); // Sincronizar el token si es necesario
  return userCredential; // 👈 Esta línea es clave
} finally {
  setAuthLoading(false);
}

};

  // Función de logout
  const logout = async () => {
  try {
    await signOut(auth);    // 1. Cierra sesión en Firebase
    
    await AsyncStorage.removeItem("user"); // 2. Limpia el almacenamiento local
    
    setUser(null); // 🔑 Resetea el estado de autenticación // 3. Actualiza el estado del contexto 
    setIsNewUser(false); // 🔑 Añade esto

    // 4. Redirige SIN historial de navegación
    router.replace("../Autentificacion/LoginScreen"); // Usa replace, no push
    
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authLoading, isNewUser , setIsNewUser}}>
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
