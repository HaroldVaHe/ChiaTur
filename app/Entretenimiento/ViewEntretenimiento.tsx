import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Link } from 'expo-router';
import { FontAwesome5, MaterialIcons, Entypo, Feather, AntDesign } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LogBox } from 'react-native';

// Ignorar el warning específico
LogBox.ignoreLogs([
  'Warning: Text strings must be rendered within a <Text> component.',
]);

interface Entretenimiento {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion: string;
}

export default function ViewEntretenimiento() {
  const [lugares, setLugares] = useState<Entretenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLugar, setSelectedLugar] = useState<Entretenimiento | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const getDireccion = async (lat: number, lon: number) => {
    const apiKey = '24977e6dc8004c0a90f1f0a256a0d69e';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=es`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted;
      }
      return 'Dirección no disponible';
    } catch (error) {
      console.error("Error al obtener dirección:", error);
      return 'Dirección no disponible';
    }
  };

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const query = `
          [out:json][timeout:25];
          (
            node["leisure"](4.83,-74.1,4.9,-74.03);
            node["amenity"="nightclub"](4.83,-74.1,4.9,-74.03);
            node["amenity"="bar"](4.83,-74.1,4.9,-74.03);
            node["amenity"="pub"](4.83,-74.1,4.9,-74.03);
            node["amenity"="biergarten"](4.83,-74.1,4.9,-74.03);
            node["shop"="mall"](4.83,-74.1,4.9,-74.03);
            node["building"="retail"](4.83,-74.1,4.9,-74.03);
          );
          out body;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        const elementosConNombre = data.elements.filter((el: any) => el.tags?.name);

        const parsed: Entretenimiento[] = await Promise.all(elementosConNombre.map(async (el: any) => {
          const direccion = await getDireccion(el.lat, el.lon);
          return {
            id: el.id.toString(),
            nombre: el.tags.name,
            latitud: el.lat,
            longitud: el.lon,
            direccion,
          };
        }));

        setLugares(parsed);
      } catch (error) {
        console.error("Error al obtener lugares:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLugares();
  }, []);

  const handleLugarPress = (lugar: Entretenimiento) => {
    setSelectedLugar(lugar);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lugar.latitud,
        longitude: lugar.longitud,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 4.8666,
          longitude: -74.065,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {selectedLugar === null &&
          lugares.map((lugar) => (
            <Marker
              key={lugar.id}
              coordinate={{
                latitude: lugar.latitud,
                longitude: lugar.longitud,
              }}
              title={lugar.nombre}
              pinColor="red"
              onPress={() => handleLugarPress(lugar)}
            />
          ))}

        {selectedLugar && (
          <Marker
            coordinate={{
              latitude: selectedLugar.latitud,
              longitude: selectedLugar.longitud,
            }}
            title={selectedLugar.nombre}
            pinColor="red"
          />
        )}
      </MapView>

      <FlatList
        data={lugares}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.lugarItem}>
            <TouchableOpacity onPress={() => handleLugarPress(item)}>
              <Text style={styles.lugarTitle}>{item.nombre}</Text>
              <Text style={styles.lugarDesc}>{item.direccion}</Text>
            </TouchableOpacity>

            <TouchableOpacity
  style={styles.button}
  onPress={() => router.push({
    pathname: '/Entretenimiento/ChatEntretenimiento',
    params: { restaurante: JSON.stringify(item) },
  })}
>
  <Text style={styles.buttonText}>Ver más</Text>
</TouchableOpacity>
          </View>
        )}
      />

      {/* Menú inferior */}
      <View style={styles.bottomMenuContainer}>
        <View style={styles.bottomMenu}>
          <TouchableOpacity
            style={[styles.menuItem, pathname.includes('Gastronomia') && styles.activeItem]}
            onPress={() => router.push('../Gastronomia/ViewGastronomia')}
          >
            <FontAwesome5 name="utensils" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Gastronomía</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, pathname.includes('Cultura') && styles.activeItem]}
            onPress={() => router.push('../Cultura/ViewCultura')}
          >
            <MaterialIcons name="museum" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Cultura</Text>
          </TouchableOpacity>

          <View style={{ width: 15 }} /> {/* Menos espacio entre los íconos */}

          <TouchableOpacity
            style={[styles.menuItem, pathname.includes('Entretenimiento') && styles.activeItem]}
            onPress={() => router.push('../Entretenimiento/ViewEntretenimiento')}
          >
            <Entypo name="game-controller" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Entretenimiento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, pathname.includes('Shopping') && styles.activeItem]}
            onPress={() => router.push('../Shopping/ViewShopping')}
          >
            <Feather name="shopping-bag" size={28} color="#FFD700" />
            <Text style={styles.menuText}>Compras</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.floatingButton, pathname.includes('MainMenu') && styles.activeFloatingButton]}
          onPress={() => router.push('../MenuPrincipal/MainMenu')}
        >
          <AntDesign name="home" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  map: { width: '100%', height: '50%' },
  list: { padding: 10 },
  lugarItem: {
    marginBottom: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
  },
  lugarTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  lugarDesc: { fontSize: 14, color: '#fff' },
  button: {
    backgroundColor: '#FFEB3B',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
