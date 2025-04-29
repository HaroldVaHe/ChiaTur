import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/Contexto/AuthContext"; // Asegúrate de que la ruta sea correcta
import { auth, signInWithEmailAndPassword } from "@/utils/firebaseConfig";  // Importar desde firebaseConfig
import { useRouter } from "expo-router";  // Importar useRouter para navegación

const LoginScreen = () => {
  const { login, loading } = useAuth(); // Utilizamos el contexto para acceder al login
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter(); // Inicializamos el hook de navegación

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Por favor ingrese un correo y contraseña");
      return;
    }

    try {
      await login(email, password);
      router.push("/MenuPrincipal/MainMenu");  // Redirige a la pantalla principal después de iniciar sesión
    } catch (error: any) {
      console.error("Error al iniciar sesión", error);
      Alert.alert("Error", "Hubo un error al iniciar sesión. Verifique sus credenciales.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>Cargando...</Text>
        ) : (
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Autentificacion/RegisterScreen")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#4CAF50", // Verde
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50", // Verde
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#80e0a7", // Verde más claro cuando está deshabilitado
  },
  link: {
    marginTop: 20,
    color: "#4CAF50", // Amarillo
    textAlign: "center",
  },
});

export default LoginScreen;
