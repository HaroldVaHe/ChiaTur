import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo, Feather, AntDesign } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';import { LogBox } from 'react-native';
import { CameraView, Camera } from "expo-camera"; // Importar componentes de cámara

LogBox.ignoreLogs([
  'Warning: Text strings must be rendered within a <Text> component.',
]);

export default function MainMenu() {
  const router = useRouter();
  const pathname = usePathname(); // Detecta ruta activa
    const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Estado para permisos de cámara
    const [cameraVisible, setCameraVisible] = useState(false); // Estado para visibilidad de la cámara
    const [scanned, setScanned] = useState(false);
    
    
    const Validos = [
    { nombre: "Valvanera", ruta: "../QRs/Valvanera" },
    { nombre: "ParqueOspina", ruta: "../QRs/ParqueOspina" },
    { nombre: "MiradorYerbabuena", ruta: "../QRs/MiradorYerbabuena" },
  { nombre: "CatedralSantaCruz", ruta: "../QRs/CatedralSantaCruz" },
  { nombre: "CasaCultura", ruta: "../QRs/CasaCultura" },
  { nombre: "ParquePuenteComun", ruta: "../QRs/ParquePuenteComun" },
];
const handleBarCodeScanned = ({ data }: { data: string }) => {
  setScanned(true);
  const lugar = Validos.find(r => data.includes(r.nombre));

  if (lugar) {
    Alert.alert("✅ Calificación aprobada", `Informacion sobre: ${lugar.nombre}`);
    setCameraVisible(false);
    router.push(lugar.ruta as any);
  } else {
    Alert.alert("❌ Código inválido", `El QR trajo la siguiente información: ${data}\nNo coincide con ningún lugar de interes registrado.`);
    setCameraVisible(false);
  }
};


  return (
    <View style={styles.container}>
      {/* Contenido principal scrollable */}
      <ScrollView style={styles.topSection}>
        <View style={styles.header}>
       <TouchableOpacity
  style={styles.qrButton}
  onPress={() => {
    setCameraVisible(true);
    setScanned(false);
  }}
>
  <FontAwesome5 name="qrcode" size={24} color="#fff" />
  <Text style={styles.qrButtonText}>QR</Text>
</TouchableOpacity>
          <Image
            source={require('@/assets/images/LogoChia.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>ChíaTur</Text>
        </View>
        <Text style={styles.subtitle}>¿Sabías que?</Text>
        <Text style={styles.factText}>
          Chía es un municipio con un gran patrimonio cultural y gastronómico, conocido por su cercanía a Bogotá y su gran belleza natural. ¡Visítalo y descubre todo lo que tiene para ofrecer!
        </Text>

        <Text style={styles.subtitle}>Datos curiosos</Text>
        <Text style={styles.factText}>
          1. Chía es conocida por su importante herencia precolombina, con sitios arqueológicos como el famoso "Pozo de las Ánimas", ubicado en la vereda Fonquetá.
        </Text>
        <Text style={styles.factText}>
          2. El municipio tiene una amplia oferta gastronómica, donde destacan platos típicos como el ajiaco y las empanadas.
        </Text>
        <Text style={styles.factText}>
          3. Es el lugar ideal para disfrutar de actividades al aire libre, como senderismo en el Cerro de la Sabana.
        </Text>
        <Text style={styles.factText}>
          4. En Chía se realizan eventos como el Festival de la Luna y la Fiesta de la Virgen del Carmen, que atraen a turistas y locales.
        </Text>
        <Text style={styles.finalfactText}>
          5. Muy cerca encontrarás sitios como la Laguna de Guatavita y el Parque Jaime Duque, ideales para el turismo en familia.
        </Text>
      </ScrollView>
 {/* Modal con cámara */}
      <Modal visible={cameraVisible} animationType="slide">
        <CameraView
          style={{ flex: 1 }}
onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        >
          <View style={{ flex: 1, justifyContent: "flex-end", padding: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#000000AA",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => {
                setCameraVisible(false);
                setScanned(false); // Resetear el estado de escaneo al cerrar la cámara
              }}
            >
              <Text style={{ color: "#FFF" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </Modal>
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

          {/* Reducido el espacio entre los íconos */}
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

        {/* Botón Home flotante */}
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 70,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 18,
    color: '#388E3C',
    marginVertical: 10,
  },
  factText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 8,
  },
  finalfactText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 50,
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
  qrButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#4CAF50',
  padding: 10,
  borderRadius: 8,
  alignSelf: 'flex-end',
  marginVertical: 10,
},
qrButtonText: {
  color: '#fff',
  marginLeft: 8,
  fontSize: 16,
  fontWeight: 'bold',
},

});
