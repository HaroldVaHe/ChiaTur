import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Usamos useLocalSearchParams para obtener los parámetros de la ruta

interface Restaurante {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion: string;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatGastronomia = () => {
  const { restaurante } = useLocalSearchParams();
  const [restauranteData, setRestauranteData] = useState<Restaurante | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Estado para los mensajes del chat
  const [newMessage, setNewMessage] = useState(''); // Estado para el nuevo mensaje

  React.useEffect(() => {
    if (restaurante) {
      setRestauranteData(JSON.parse(restaurante as string)); // Parseamos el restaurante
    }
  }, [restaurante]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Agregar mensaje del usuario
      const userMessage: Message = { text: newMessage, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Respuesta simulada del bot (IA)
      const botResponse: Message = { text: "Gracias por tu mensaje, ¿cómo puedo ayudarte?", sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

      setNewMessage(''); // Limpiar el campo de texto
    }
  };

  if (!restauranteData) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Mostrar la información del restaurante */}
      <View style={styles.restauranteInfo}>
        <Text style={styles.title}>{restauranteData.nombre}</Text>
        <Text>{restauranteData.direccion}</Text>
        <Text>Latitud: {restauranteData.latitud}</Text>
        <Text>Longitud: {restauranteData.longitud}</Text>
      </View>

      {/* Mostrar los mensajes del chat */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={styles.chatContainer}
      />

      {/* Campo de entrada de mensaje */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe tu mensaje"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  restauranteInfo: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  chatContainer: { flex: 1, marginBottom: 20 },
  message: { marginVertical: 5, padding: 10, borderRadius: 8, maxWidth: '80%' },
  userMessage: { backgroundColor: '#4CAF50', alignSelf: 'flex-end' },
  botMessage: { backgroundColor: '#FFEB3B', alignSelf: 'flex-start' },
  messageText: { color: 'white', fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: { backgroundColor: '#FFEB3B', borderRadius: 20, padding: 10 },
  sendButtonText: { color: '#000', fontWeight: 'bold' },
});

export default ChatGastronomia;
