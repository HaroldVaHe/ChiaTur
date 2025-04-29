import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // Usando useRouter de expo-router
import ViewGastronomia from '../Gastronomia/ViewGastronomia';

export default function MainMenu() {
  const router = useRouter();  // Usamos useRouter

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/DiosaLunaChia.jpg')} // asegúrate de poner la extensión correcta
        style={styles.avatar}
      />
      
      <Text style={styles.title}>ChíaTur</Text>
      <Text style={styles.subtitle}>¿Qué quieres hacer?</Text>

      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('../Gastronomia/ViewGastronomia')}  // Usamos router.push en lugar de navigate
        >
          <FontAwesome5 name="utensils" size={32} color="#FFC107" />
          <Text style={styles.buttonText}>Gastronomía</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="museum" size={32} color="#FFC107" />
          <Text style={styles.buttonText}>Cultura</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Entypo name="game-controller" size={32} color="#FFC107" />
          <Text style={styles.buttonText}>Entretenimiento</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.button}
  onPress={() => router.push('../Shopping/ViewShopping')} // Agregamos navegación
>
  <Feather name="shopping-bag" size={32} color="#FFC107" />
  <Text style={styles.buttonText}>Shopping</Text>
</TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#388E3C',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 20,
    color: '#4CAF50',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    width: 130,
    height: 130,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
