// pushSender.ts
import fetch from "node-fetch";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import * as fs from "fs";

// ✅ Si tienes un archivo de clave privada descargado desde Firebase Console
const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const enviarNotificacionesPorInteres = async (interes: string, mensaje: string) => {
  const snapshot = await db.collection("users").where("intereses", "array-contains", interes).get();

  if (snapshot.empty) {
    console.log(`No hay usuarios con el interés: ${interes}`);
    return;
  }

  const mensajes: any[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (!data.expoPushToken) return;

    mensajes.push({
      to: data.expoPushToken,
      sound: "default",
      title: `Noticia de ${interes}`,
      body: mensaje,
      data: { tipo: interes },
    });
  });

  const chunks = dividirEnBloques(mensajes, 100);
  for (const chunk of chunks) {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk),
    });

    const data = await res.json();
    console.log("Resultado:", data);
  }

  console.log(`✅ Notificaciones enviadas para interés: ${interes}`);
};

const enviarNotificacionesPorTodosLosIntereses = async () => {
    const snapshot = await db.collection("users").get();
  
    const interesesMap: Record<string, string[]> = {}; // interés -> lista de tokens
  
    snapshot.forEach((doc) => {
      const data = doc.data();
      const intereses = data.intereses || [];
      const token = data.expoPushToken;
      if (!token) return;
  
      intereses.forEach((interes: string) => {
        if (!interesesMap[interes]) interesesMap[interes] = [];
        interesesMap[interes].push(token);
      });
    });
  
    for (const interes in interesesMap) {
      const tokens = interesesMap[interes];
      const mensajes = tokens.map((to) => ({
        to,
        sound: "default",
        title: `Nuevo evento de ${interes}`,
        body: `Tenemos novedades sobre ${interes}. ¡Échales un vistazo!`,
        data: { tipo: interes },
      }));
  
      const chunks = dividirEnBloques(mensajes, 100);
      for (const chunk of chunks) {
        const res = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chunk),
        });
  
        const data = await res.json();
        console.log(`🔔 Interés: ${interes}`, data);
      }
    }
  
    console.log("✅ Notificaciones enviadas por cada tipo de interés.");
  };
  

const dividirEnBloques = (array: any[], tamaño: number) =>
  Array.from({ length: Math.ceil(array.length / tamaño) }, (_, i) =>
    array.slice(i * tamaño, i * tamaño + tamaño)
  );

// Ejemplo:
enviarNotificacionesPorTodosLosIntereses();
enviarNotificacionesPorInteres("Cultura", "¡Conoce los eventos culturales de esta semana! 🎭");
enviarNotificacionesPorInteres("Gastronomía", "¡Descubre los mejores restaurantes de la ciudad! 🍽️");
enviarNotificacionesPorInteres("Entretenimiento", "¡No te pierdas las últimas películas en cartelera! 🎬");
enviarNotificacionesPorInteres("Shopping", "Que oferta vas a aprovechar hoy? 🛍️"); 