// screens/ViewGastronomia.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function ViewGastronomia() {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const fetchRestaurantes = async () => {
    try {
      const response = await fetch(
        'https://nominatim.openstreetmap.org/search?city=Chía&country=Colombia&amenity=restaurant&format=json'
      );
      const data = await response.json();
      setRestaurantes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener restaurantes:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4CAF50" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.864,
          longitude: -74.05,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {restaurantes.map((restaurante, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(restaurante.lat),
              longitude: parseFloat(restaurante.lon),
            }}
            title={restaurante.display_name.split(',')[0]}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
