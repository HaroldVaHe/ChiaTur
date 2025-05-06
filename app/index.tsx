// app/index.tsx
import React, { useCallback } from 'react';
import ChiaTur from '../components/WelcomeCard';
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importar GestureHandlerRootView

// Evita que la app se muestre hasta que la fuente esté cargada
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'FigmaHands': require('../assets/fonts/AnnieUseYourTelescope-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    // Envuelve el contenido dentro de GestureHandlerRootView
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <ChiaTur />
      </View>
    </GestureHandlerRootView>
  );
}
