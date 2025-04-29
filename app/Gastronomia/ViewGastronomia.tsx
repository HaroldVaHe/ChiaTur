import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Link } from 'expo-router';  // Importar Link de Expo Router

interface Restaurante {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion: string;
}

export default function ViewGastronomia() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurante, setSelectedRestaurante] = useState<Restaurante | null>(null); // Estado para el restaurante seleccionado
  const mapRef = useRef<MapView | null>(null); // Referencia al MapView

  // Función para obtener la dirección usando OpenCage Geocoder
  const getDireccion = async (lat: number, lon: number) => {
    const apiKey = '24977e6dc8004c0a90f1f0a256a0d69e';  // Tu clave de API
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=es`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted;  // Dirección formateada
      }
      return 'Dirección no disponible';
    } catch (error) {
      console.error("Error al obtener dirección:", error);
      return 'Dirección no disponible';
    }
  };

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const query = `
          [out:json];
          node["amenity"="restaurant"](4.83,-74.1,4.9,-74.03); // Coordenadas de Chía, Cundinamarca
          out body;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        const parsed: Restaurante[] = await Promise.all(data.elements.map(async (el: any) => {
          const direccion = await getDireccion(el.lat, el.lon); // Obtener la dirección
          return {
            id: el.id.toString(),
            nombre: el.tags?.name || "Restaurante sin nombre",
            latitud: el.lat,
            longitud: el.lon,
            direccion,  // Agregar la dirección obtenida
          };
        }));

        setRestaurantes(parsed);
      } catch (error) {
        console.error("Error al obtener restaurantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, []);

  // Función para centrar el mapa en el restaurante seleccionado
  const handleRestaurantPress = (restaurante: Restaurante) => {
    setSelectedRestaurante(restaurante);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: restaurante.latitud,
        longitude: restaurante.longitud,
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
        ref={mapRef}  // Asignamos la referencia al MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.8666,
          longitude: -74.065,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Si no hay restaurante seleccionado, mostramos todos los marcadores */}
        {selectedRestaurante === null &&
          restaurantes.map((restaurante) => (
            <Marker
              key={restaurante.id}
              coordinate={{
                latitude: restaurante.latitud,
                longitude: restaurante.longitud,
              }}
              title={restaurante.nombre}
              pinColor="red"  // Hacer el pin rojo
              onPress={() => handleRestaurantPress(restaurante)}  // Al presionar un marcador, se selecciona el restaurante
            />
          ))}

        {/* Si hay un restaurante seleccionado, mostramos solo ese marcador */}
        {selectedRestaurante && (
          <Marker
            coordinate={{
              latitude: selectedRestaurante.latitud,
              longitude: selectedRestaurante.longitud,
            }}
            title={selectedRestaurante.nombre}
            pinColor="red"  // Hacer el pin rojo
          />
        )}
      </MapView>

      <FlatList
        data={restaurantes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.restauranteItem}>
            <TouchableOpacity onPress={() => handleRestaurantPress(item)}>
              <Text style={styles.restauranteTitle}>{item.nombre}</Text>
              <Text style={styles.restauranteDesc}>
                {item.direccion} {/* Mostrar la dirección */}
              </Text>
            </TouchableOpacity>

            {/* Botón Ver más debajo de cada restaurante */}
            <Link
              href={{
                pathname: '/Gastronomia/ChatGastronomia',  // Ruta a la vista ChatGastronomia
                params: { restaurante: JSON.stringify(item) },  // Serializar el objeto del restaurante
              }}
            >
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Ver más</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  map: { width: '100%', height: '50%' },
  list: { padding: 10 },
  restauranteItem: {
    marginBottom: 15,
    backgroundColor: '#4CAF50',  // Fondo verde
    borderRadius: 8,
    padding: 10,
  },
  restauranteTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },  // Letra blanca
  restauranteDesc: { fontSize: 14, color: '#fff' },  // Letra blanca
  button: {
    backgroundColor: '#FFEB3B',  // Amarillo
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%', // Esto hace que el botón ocupe todo el ancho disponible
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',  // Color del texto en el botón
  },
});
