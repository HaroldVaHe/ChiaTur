import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, LogBox, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Link, useRouter, usePathname } from 'expo-router';
import { FontAwesome5 } from 'react-native-vector-icons';

import { MaterialIcons, Entypo, Feather, AntDesign } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested'
]);

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.6;

interface Restaurante {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion: string;
  estrellas?: number;
}

export default function ViewGastronomia() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurante, setSelectedRestaurante] = useState<Restaurante | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Variables para el sheet
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const animationInProgress = useRef(false);

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
    const fetchRestaurantes = async () => {
      try {
        const query = `
          [out:json];
          (
            node["amenity"="restaurant"](4.83,-74.1,4.9,-74.03);
            node["amenity"="cafe"](4.83,-74.1,4.9,-74.03);
            node["amenity"="bar"](4.83,-74.1,4.9,-74.03);
            node["amenity"="fast_food"](4.83,-74.1,4.9,-74.03);
          );
          out body;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        const parsed: Restaurante[] = await Promise.all(data.elements.map(async (el: any) => {
          const direccion = await getDireccion(el.lat, el.lon);
          return {
            id: el.id.toString(),
            nombre: el.tags?.name || "Restaurante sin nombre",
            latitud: el.lat,
            longitud: el.lon,
            direccion,
            estrellas: Math.floor(Math.random() * 5) + 1, // Estrellas aleatorias entre 1-5
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

  const handleRestaurantePress = (restaurante: Restaurante) => {
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

  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome5
          key={i}
          name={i <= rating ? "star" : "star"}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row', marginTop: 5 }}>{stars}</View>;
  };

  const updateIsExpanded = (value: boolean) => {
    setIsExpanded(value);
    animationInProgress.current = false;
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      if (animationInProgress.current) return;
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      if (animationInProgress.current) return;
      translateY.value = Math.max(Math.min(event.translationY + context.value.y, 0), MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (animationInProgress.current) return;
      
      const shouldBringUp = translateY.value < -SCREEN_HEIGHT * 0.2;
      
      animationInProgress.current = true;
      
      if (shouldBringUp) {
        translateY.value = withTiming(MAX_TRANSLATE_Y, { duration: 300 }, () => {
          runOnJS(updateIsExpanded)(true);
        });
      } else {
        translateY.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(updateIsExpanded)(false);
        });
      }
    });
    
  useEffect(() => {
    const timer = setTimeout(() => {
      animationInProgress.current = false;
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const toggleSheet = () => {
    if (animationInProgress.current) return;
    
    animationInProgress.current = true;
    
    if (isExpanded) {
      translateY.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(updateIsExpanded)(false);
      });
    } else {
      translateY.value = withTiming(MAX_TRANSLATE_Y, { duration: 250 }, () => {
        runOnJS(updateIsExpanded)(true);
      });
    }
  };

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: SCREEN_HEIGHT + 100,
    };
  });

  const rMapStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y, 0],
        [SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT * 0.5]
      ),
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando restaurantes...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.mapContainer, rMapStyle]}>
        <MapView
          ref={mapRef}
          style={styles.mapView}
          initialRegion={{
            latitude: 4.8666,
            longitude: -74.065,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {selectedRestaurante === null &&
            restaurantes.map((restaurante) => (
              <Marker
                key={restaurante.id}
                coordinate={{
                  latitude: restaurante.latitud,
                  longitude: restaurante.longitud,
                }}
                title={restaurante.nombre}
                pinColor="red"
                onPress={() => handleRestaurantePress(restaurante)}
              />
            ))}

          {selectedRestaurante && (
            <Marker
              coordinate={{
                latitude: selectedRestaurante.latitud,
                longitude: selectedRestaurante.longitud,
              }}
              title={selectedRestaurante.nombre}
              pinColor="red"
            />
          )}
        </MapView>
      </Animated.View>

      <Animated.View style={[styles.bottomSheet, rBottomSheetStyle]}>
        <GestureDetector gesture={gesture}>
          <View style={styles.sheetHeader}>
            <View style={styles.line} />
          </View>
        </GestureDetector>

        <View style={styles.listContainer}>
          <FlatList
            data={restaurantes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: isExpanded ? 120 : 80 }
            ]}
            scrollEnabled={true}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
            onEndReachedThreshold={0.1}
            alwaysBounceVertical={true}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => handleRestaurantePress(item)}>
                  <Text style={styles.title}>{item.nombre}</Text>
                  <Text style={styles.desc}><Text style={styles.labelText}>Dirección:</Text> {item.direccion}</Text>
                  <StarRating rating={item.estrellas || 4} />
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                  <Link
                    href={{
                      pathname: '../Gastronomia/ChatGastronomia',
                      params: { restaurante: JSON.stringify(item) },
                    }}
                    asChild
                  >
                    <TouchableOpacity style={styles.squareButton}>
                      <FontAwesome5 name="robot" size={24} color="#000" />
                      <Text style={styles.squareButtonText}>Preguntar</Text>
                    </TouchableOpacity>
                  </Link>

                  <TouchableOpacity style={styles.squareButton}>
                    <FontAwesome5 name="star" size={24} color="#000" />
                    <Text style={styles.squareButtonText}>Calificar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </Animated.View>
      
      {isExpanded && (
        <TouchableOpacity 
          style={styles.floatingCollapseButton}
          onPress={toggleSheet}
          activeOpacity={0.7}
        >
          <AntDesign name="down" size={20} color="black" />
          <Text style={styles.floatingButtonText}>Ver menos</Text>
        </TouchableOpacity>
      )}

      {!isExpanded && (
        <TouchableOpacity 
          style={styles.floatingExpandButton}
          onPress={toggleSheet}
          activeOpacity={0.7}
        >
          <AntDesign name="up" size={20} color="black" />
          <Text style={styles.floatingButtonText}>Ver más</Text>
        </TouchableOpacity>
      )}

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

          <View style={{ width: 15 }} />

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
          style={styles.floatingButton}
          onPress={() => router.push('../MenuPrincipal/MainMenu')}
        >
          <AntDesign name="home" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

// Los estilos son exactamente los mismos que en ViewCultura
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'transparent' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  mapContainer: { 
    width: '100%', 
    height: '50%',
    zIndex: 1
  },
  mapView: { 
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    backgroundColor: '#F1F2EE',
    width: '100%',
    position: 'absolute',
    top: '50%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  floatingExpandButton: {
    position: 'absolute',
    left: 20,
    bottom: 90,
    backgroundColor: '#FFEB3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingCollapseButton: {
    position: 'absolute',
    left: 20,
    bottom: 90,
    backgroundColor: '#FFEB3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 6,
  },
  sheetHeader: {
    width: '100%',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  list: { 
    padding: 10,
  },
  item: {
    marginBottom: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  desc: { 
    fontSize: 14, 
    color: '#fff',
    marginTop: 5,
  },
  labelText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  squareButton: {
    backgroundColor: '#FFEB3B',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    width: '48%',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  squareButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  bottomMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    alignItems: 'center',
    zIndex: 3,
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
});