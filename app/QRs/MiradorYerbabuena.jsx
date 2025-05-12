import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome5, MaterialIcons, Entypo, Feather, AntDesign } from '@expo/vector-icons';

export default function MiradorYerbabuena() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.topSection}>
        <Image
          source={require('@/assets/images/LogoChia.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>Mirador Yerbabuena</Text>
        <Text style={styles.factText}>
          El Mirador Yerbabuena ofrece una vista panorámica única de Chía y los alrededores. 
          Un lugar perfecto para disfrutar de la naturaleza y capturar hermosas fotografías.
        </Text>

         <Image
          source={require('@/assets/images/MiradorYerbabuena.jpg')}
          style={styles.image}
        />
      </ScrollView>

      {/* Menú inferior */}
      <View style={styles.bottomMenuContainer}>
        <View style={styles.bottomMenu}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              pathname.includes('Gastronomia') && styles.activeItem,
            ]}
            onPress={() => router.push('../Gastronomia/ViewGastronomia')}
          >
            <FontAwesome5 name="utensils" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Gastronomía</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              pathname.includes('Cultura') && styles.activeItem,
            ]}
            onPress={() => router.push('../Cultura/ViewCultura')}
          >
            <MaterialIcons name="museum" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Cultura</Text>
          </TouchableOpacity>

          <View style={{ width: 15 }} />

          <TouchableOpacity
            style={[
              styles.menuItem,
              pathname.includes('Entretenimiento') && styles.activeItem,
            ]}
            onPress={() => router.push('../Entretenimiento/ViewEntretenimiento')}
          >
            <Entypo name="game-controller" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Entretenimiento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              pathname.includes('Shopping') && styles.activeItem,
            ]}
            onPress={() => router.push('../Shopping/ViewShopping')}
          >
            <Feather name="shopping-bag" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Compras</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Home flotante */}
        <TouchableOpacity
          style={[
            styles.floatingButton,
            pathname.includes('MainMenu') && styles.activeFloatingButton,
          ]}
          onPress={() => router.push('../MenuPrincipal/MainMenu')}
        >
          <AntDesign name="home" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 90,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  factText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'justify',
  },
  bottomMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    alignItems: 'center',
  },
  bottomMenu: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: '#388E3C',
  },
  menuText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#4CAF50',
    borderRadius: 35,
    padding: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activeFloatingButton: {
    backgroundColor: '#388E3C',
  },
});
