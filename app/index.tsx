// app/index.tsx
import React from 'react';
import ChiaTur from '../components/WelcomeCard';
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';


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
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      
      <ChiaTur />
    </View>
  );
}
