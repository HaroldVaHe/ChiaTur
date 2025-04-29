import { Stack } from "expo-router";
import { AuthProvider } from "@/Contexto/AuthContext"; // Asegúrate de que la ruta sea correcta

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
