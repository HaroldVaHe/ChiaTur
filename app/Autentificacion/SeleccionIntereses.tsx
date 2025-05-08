import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig"; // Usamos db desde aquí
import { useAuth } from "@/Contexto/AuthContext"; // 👈 Importar el contexto de auth

const interesesDisponibles = ["Gastronomía", "Entretenimiento", "Cultura", "Shopping"];

const SeleccionIntereses = () => {
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const router = useRouter();
  const { user } = useAuth(); // 👈 Obtener el usuario autenticado

  const toggleInteres = (interes: string) => {
    setSeleccionados((prev) =>
      prev.includes(interes)
        ? prev.filter((i) => i !== interes)
        : [...prev, interes]
    );
  };

  const guardarPreferencias = async () => {
    if (seleccionados.length === 0) {
      Alert.alert("Selecciona al menos un interés");
      return;
    }

    if (!user) {
      Alert.alert("Error: Usuario no autenticado");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        { intereses: seleccionados },
        { merge: true }
      );

      router.replace("/MenuPrincipal/MainMenu");
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
      Alert.alert("Error al guardar preferencias");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tus intereses</Text>
      {interesesDisponibles.map((interes) => (
        <TouchableOpacity
          key={interes}
          style={[
            styles.interes,
            seleccionados.includes(interes) && styles.seleccionado,
          ]}
          onPress={() => toggleInteres(interes)}
        >
          <Text>{interes}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.boton} onPress={guardarPreferencias}>
        <Text style={styles.botonTexto}>Guardar y continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24 },
  interes: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  seleccionado: {
    backgroundColor: "#FFEB3B",
  },
  boton: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  botonTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SeleccionIntereses;
