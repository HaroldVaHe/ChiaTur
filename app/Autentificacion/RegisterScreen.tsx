import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useAuth } from "@/Contexto/AuthContext";
import { auth, createUserWithEmailAndPassword } from "@/utils/firebaseConfig";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";


// Asegúrate de ajustar esta ruta según tu estructura real
import LogoChia from "@/assets/images/LogoChia.jpg";

const RegisterScreen = () => {
  const { register, authLoading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Por favor ingrese un correo y contraseña");
      return;
    }

    try {
      const credenciales = await register(email, password);
      const uid = credenciales.user.uid; // obtener el uid del usuario

      router.push({
        pathname: "/Autentificacion/SeleccionIntereses",
        params: { uid }
      });
      Alert.alert("Cuenta creada con éxito");

    } catch (error: any) {
      console.error("Error al crear la cuenta", error);
      Alert.alert("Error", "Hubo un error al crear la cuenta. Verifique sus datos.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={LogoChia} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Crear cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, authLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={authLoading}
        >
          {authLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>


        <TouchableOpacity onPress={() => router.push("/Autentificacion/LoginScreen")}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",

  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#4CAF50",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  link: {
    marginTop: 20,
    color: "#4CAF50",
    textAlign: "center",
    fontSize: 16,
  },
});
