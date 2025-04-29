import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const WelcomeCard = () => {
  const router = useRouter(); // ✅ Aquí definimos el hook

  return (
    <View style={styles.container}>
      {/* Imagen de perfil flotando */}
      <Image
        source={require('@/assets/images/DiosaLunaChia.jpg')}
        style={styles.profileImage}
      />

      {/* Título */}
      <Text style={{ fontFamily: 'FigmaHands', fontSize: 32, color: 'white' }}>
        Chía
        <Text style={{ fontWeight: 'bold' }}>Tur</Text>
      </Text>

      <Text style={styles.subtitle}>Bienvenido a Chía, la Ciudad de la Luna 🌙</Text>

      {/* Imagen central */}
      <Image
        source={require('@/assets/images/Chia.jpg')}
        style={styles.mainImage}
      />

      {/* Descripción */}
      <Text style={styles.description}>
        Ubicada al norte de la Capital, Chía combina historia, cultura y modernidad. Con un legado muisca, es hogar de íconos como Centro Histórico y el Puente del Común.
      </Text>
      <Text style={styles.description}>
        Descubre su gastronomía, historia y entretenimiento en un solo lugar. ¡Chía te espera!
      </Text>

      {/* Botón de flecha */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => router.push('/Autentificacion/LoginScreen')} // ✅ Aquí la navegación
      >
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 80,
    backgroundColor: '#1E8F2E',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    top: -30,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 5,
  },
  arrowButton: {
    marginTop: 15,
    backgroundColor: '#FDB813',
    borderRadius: 25,
    padding: 10,
  },
});

export default WelcomeCard;
