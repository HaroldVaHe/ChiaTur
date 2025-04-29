import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Link } from 'expo-router';

interface Tienda {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion: string;
}

export default function ViewTiendas() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTienda, setSelectedTienda] = useState<Tienda | null>(null);
  const mapRef = useRef<MapView | null>(null); // Referencia para el mapa

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
    const fetchTiendas = async () => {
      try {
        const query = `
          [out:json];
          node["shop"](4.83,-74.1,4.9,-74.03);
          out body;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        const parsed: Tienda[] = await Promise.all(data.elements.map(async (el: any) => {
          const direccion = await getDireccion(el.lat, el.lon);
          return {
            id: el.id.toString(),
            nombre: el.tags?.name || "Tienda sin nombre",
            latitud: el.lat,
            longitud: el.lon,
            direccion,
          };
        }));

        setTiendas(parsed);
      } catch (error) {
        console.error("Error al obtener tiendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiendas();
  }, []);

  // Función para centrar el mapa en la tienda seleccionada
  const handleTiendaPress = (tienda: Tienda) => {
    setSelectedTienda(tienda);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: tienda.latitud,
        longitude: tienda.longitud,
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
        {/* Si no hay tienda seleccionada, mostramos todos los marcadores */}
        {selectedTienda === null && tiendas.map((tienda) => (
          <Marker
            key={tienda.id}
            coordinate={{
              latitude: tienda.latitud,
              longitude: tienda.longitud,
            }}
            title={tienda.nombre}
            pinColor="red"  // Todos los marcadores son rojos
            onPress={() => handleTiendaPress(tienda)}  // Al presionar un marcador, se selecciona la tienda
          />
        ))}

        {/* Si hay una tienda seleccionada, solo mostramos ese marcador */}
        {selectedTienda && (
          <Marker
            coordinate={{
              latitude: selectedTienda.latitud,
              longitude: selectedTienda.longitud,
            }}
            title={selectedTienda.nombre}
            pinColor="red"  // El pin seleccionado es rojo
          />
        )}
      </MapView>

      <FlatList
        data={tiendas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={() => handleTiendaPress(item)}>
              <Text style={styles.title}>{item.nombre}</Text>
              <Text style={styles.desc}>{item.direccion}</Text>
            </TouchableOpacity>

            <Link
              href={{
                pathname: '../Shopping/ChatShopping',
                params: { tienda: JSON.stringify(item) },
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
  item: {
    marginBottom: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  desc: { fontSize: 14, color: '#fff' },
  button: {
    backgroundColor: '#FFEB3B',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
    width: '100%', // Esto hace que el botón ocupe todo el ancho disponible
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
