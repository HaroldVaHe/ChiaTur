import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, LogBox, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Link, useRouter, usePathname } from 'expo-router';
import { FontAwesome5, MaterialIcons, Entypo, Feather, AntDesign } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

// Ignorar advertencias específicas que podrían afectar el rendimiento pero no la funcionalidad
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested'
]);

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.6; // Aumentamos el valor para que la pantalla se expanda más

interface Cultura {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion: string;
  estrellas?: number;
}

export default function ViewCultura() {
  const [lugares, setLugares] = useState<Cultura[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLugar, setSelectedLugar] = useState<Cultura | null>(null);
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
            estrellas: 4, // Todas comienzan con 4 estrellas por defecto
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

  // Componente para renderizar estrellas
  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome5
          key={i}
          name={i <= rating ? "star" : "star-o"}
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

  // Gesto para el sheet - limitado solo a la parte superior del sheet (el handle)
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
      
      // Snap to either top or bottom position
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
    
  // Asegurar que la lista se actualice cuando cambia el estado del sheet
  useEffect(() => {
    // Solo para mantener la referencia de si hay una animación en curso
    const timer = setTimeout(() => {
      animationInProgress.current = false;
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const toggleSheet = () => {
    if (animationInProgress.current) return;
    
    animationInProgress.current = true;
    
    if (isExpanded) {
      // Si está expandido, vuelve a la posición original
      translateY.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(updateIsExpanded)(false);
      });
    } else {
      // Si está colapsado, expande
      translateY.value = withTiming(MAX_TRANSLATE_Y, { duration: 250 }, () => {
        runOnJS(updateIsExpanded)(true);
      });
    }
  };

  // Estilos animados para el sheet
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      // Aseguramos que cuando está expandido, el sheet ocupe todo el espacio disponible
      height: SCREEN_HEIGHT + 100, // Siempre aseguramos espacio suficiente
    };
  });

  // Estilo animado para el mapa
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
        <Text style={styles.loadingText}>Cargando lugares culturales...</Text>
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
      </Animated.View>

      <Animated.View style={[styles.bottomSheet, rBottomSheetStyle]}>
        <GestureDetector gesture={gesture}>
          <View style={styles.sheetHeader}>
            <View style={styles.line} />
          </View>
        </GestureDetector>

        <View style={styles.listContainer}>
          <FlatList
            data={lugares}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.list,
              // Padding extra para asegurar que haya espacio para el botón flotante inferior
              { paddingBottom: isExpanded ? 120 : 80 }
            ]}
            scrollEnabled={true}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
            onEndReachedThreshold={0.1}
            alwaysBounceVertical={true}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => handleLugarPress(item)}>
                  <Text style={styles.title}>{item.nombre}</Text>
                  <Text style={styles.desc}><Text style={styles.labelText}>Dirección:</Text> {item.direccion}</Text>
                  <StarRating rating={item.estrellas || 4} />
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                  <Link
                    href={{
                      pathname: '../Cultura/ChatCultura',
                      params: { lugar: JSON.stringify(item) },
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
      
      {/* Botones flotantes reposicionados al lado izquierdo con color amarillo */}
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
            style={styles.menuItem}
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
    left: 20, // Cambiado de right a left
    bottom: 90,
    backgroundColor: '#FFEB3B', // Cambiado a amarillo
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
    left: 20, // Cambiado de right a left
    bottom: 90,
    backgroundColor: '#FFEB3B', // Cambiado a amarillo
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
    color: 'black', // Cambiado a negro para mejor contraste con el fondo amarillo
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
    width: '48%', // Para que quepan dos botones con espacio entre ellos
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