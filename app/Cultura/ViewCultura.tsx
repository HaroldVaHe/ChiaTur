// ViewCultura.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Link } from 'expo-router';

interface Cultura {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion: string;
}

export default function ViewCultura() {
  const [lugares, setLugares] = useState<Cultura[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLugar, setSelectedLugar] = useState<Cultura | null>(null);
  const mapRef = useRef<MapView | null>(null);

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
          [out:json];
          (
            node["tourism"="museum"](4.83,-74.1,4.9,-74.03);
            node["amenity"="theatre"](4.83,-74.1,4.9,-74.03);
            node["tourism"="artwork"](4.83,-74.1,4.9,-74.03);
            node["tourism"="gallery"](4.83,-74.1,4.9,-74.03);
            node["amenity"="arts_centre"](4.83,-74.1,4.9,-74.03);
            node["historic"="monument"](4.83,-74.1,4.9,-74.03);
            node["historic"="memorial"](4.83,-74.1,4.9,-74.03);
            node["historic"="castle"](4.83,-74.1,4.9,-74.03);
            node["historic"="archaeological_site"](4.83,-74.1,4.9,-74.03);
            node["tourism"="attraction"](4.83,-74.1,4.9,-74.03);
          );
          out body;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        const parsed: Cultura[] = await Promise.all(data.elements.map(async (el: any) => {
          const direccion = await getDireccion(el.lat, el.lon);
          return {
            id: el.id.toString(),
            nombre: el.tags?.name || "Lugar cultural sin nombre",
            latitud: el.lat,
            longitud: el.lon,
            direccion,
          };
        }));

        setLugares(parsed);
      } catch (error) {
        console.error("Error al obtener lugares culturales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLugares();
  }, []);

  const handleLugarPress = (lugar: Cultura) => {
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
          <View style={styles.item}>
            <TouchableOpacity onPress={() => handleLugarPress(item)}>
              <Text style={styles.title}>{item.nombre}</Text>
              <Text style={styles.desc}>{item.direccion}</Text>
            </TouchableOpacity>

            <Link
              href={{
                pathname: '../Cultura/ChatCultura',
                params: { lugar: JSON.stringify(item) },
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
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
