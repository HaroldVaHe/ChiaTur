// ChatCultura.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { APIResponse } from '@/utils/Responses'; // Asegúrate que esta ruta esté bien

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const GEMINI_API_KEY = 'AIzaSyDo0NUkRMYfqvdJWrCn0Ty5LU8NAXHW4tw';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const ChatCultura = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { lugar } = useLocalSearchParams();

  const lugarData = lugar ? JSON.parse(lugar as string) : null;

  useEffect(() => {
    if (messages.length === 0 && lugarData) {
      const lugarQueryMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: `Estoy en Chía, Cundinamarca, Colombia. El lugar cultural llamado "${lugarData.nombre}" es un sitio de interés cultural local. Me gustaría que me brindaras información detallada sobre él, como su propósito cultural, historia, importancia para la comunidad, ubicación aproximada y cualquier dato interesante que puedas aportar. Si no encuentras información exacta, por favor genera una descripción creativa basada en lugares culturales similares de la región.`,
      };
      setMessages([lugarQueryMessage]);

      sendBotResponse(lugarQueryMessage.text);
    }
  }, [messages.length, lugarData]);

  const sendBotResponse = async (userText: string) => {
    setLoading(true);
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userText }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }

      const data: APIResponse = await response.json();

      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Lo siento, no encontré información sobre este lugar cultural.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al contactar a Gemini:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: 'Error al contactar a la IA. Intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await sendBotResponse(input.trim());
    setInput('');
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chat}
      />

      {loading && <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 10 }} />}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe tu mensaje..."
          editable={!loading}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={loading}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatCultura;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 10 },
  chat: { paddingVertical: 10 },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#F1F0F0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#DDD',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
