import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/Contexto/AuthContext"; // Asegúrate de que la ruta sea correcta
import { auth, createUserWithEmailAndPassword } from "@/utils/firebaseConfig";  // Importar desde firebaseConfig
import { useRouter } from "expo-router";  // Importar useRouter para navegación

const RegisterScreen = () => {
  const { loading } = useAuth(); // Utilizamos el contexto para acceder al loading
=======
  const { register, loading } = useAuth();  // Usar la función register
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter(); // Inicializamos el hook de navegación

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Por favor ingrese un correo y contraseña");
      return;
    }

    try {
      // Crear cuenta con email y contraseña
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Cuenta creada con éxito");
      router.push("/MenuPrincipal/MainMenu");  // Redirige al login después de registrarse
      const credenciales = await register(email, password);
router.push({
  pathname: "/Autentificacion/SeleccionIntereses",
  params: { email }
});
      Alert.alert("Cuenta creada con éxito");
      const credenciales = await register(email, password);
router.push({
  pathname: "/Autentificacion/SeleccionIntereses",
  params: { email }
});
      Alert.alert("Cuenta creada con éxito");
      
    } catch (error: any) {
      console.error("Error al crear la cuenta", error);
      Alert.alert("Error", "Hubo un error al crear la cuenta. Verifique sus datos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

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
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.buttonText}>Cargando...</Text>
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Autentificacion/LoginScreen")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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

export default RegisterScreen;
