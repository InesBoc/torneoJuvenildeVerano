const admin = require('firebase-admin');
const serviceAccount = require('./tu-llave-privada.json'); // Descárgala de la consola de Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const nuevoFixture = [ [
  /* SÁBADO - FASE DE GRUPOS */
  { "id": 1, "cancha": "1", "categoria": "SUB 16", "dia": "Sábado", "hora": "09:00", "partido": "Part 1", "local": "SICC", "visitante": "TARCOS", "zona": "ZONA A", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 2, "cancha": "2", "categoria": "SUB 14", "dia": "Sábado", "hora": "09:00", "partido": "Part 1", "local": "UNSJ", "visitante": "TIGRES ROJO", "zona": "ZONA A", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 3, "cancha": "1", "categoria": "SUB 14", "dia": "Sábado", "hora": "09:50", "partido": "Part 2", "local": "TIGRES NEGRO", "visitante": "UNI BLANCO", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 4, "cancha": "2", "categoria": "SUB 14", "dia": "Sábado", "hora": "09:50", "partido": "Part 3", "local": "TARCOS", "visitante": "SICC", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 5, "cancha": "1", "categoria": "SUB 16", "dia": "Sábado", "hora": "10:40", "partido": "Part 2", "local": "UNI RUGBY", "visitante": "TIGRES ROJO", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 6, "cancha": "2", "categoria": "SUB 16", "dia": "Sábado", "hora": "10:40", "partido": "Part 3", "local": "UNSJ", "visitante": "JOCKEY TUC", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 7, "cancha": "1", "categoria": "SUB 16", "dia": "Sábado", "hora": "11:30", "partido": "Part 4", "local": "TIGRES NEGRO", "visitante": "SICC", "zona": "ZONA A", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 8, "cancha": "2", "categoria": "SUB 14", "dia": "Sábado", "hora": "11:30", "partido": "Part 4", "local": "TIGRES ROJO", "visitante": "UNI R VERDE", "zona": "ZONA A", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 9, "cancha": "2", "categoria": "SUB 14", "dia": "Sábado", "hora": "12:20", "partido": "Part 5", "local": "TIGRES NEGRO", "visitante": "SICC", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 10, "cancha": "1", "categoria": "SUB 14", "dia": "Sábado", "hora": "12:20", "partido": "Part 6", "local": "UNI BLANCO", "visitante": "TARCOS", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 11, "cancha": "2", "categoria": "SUB 16", "dia": "Sábado", "hora": "14:30", "partido": "Part 5", "local": "UNSJ", "visitante": "TIGRES ROJO", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 12, "cancha": "1", "categoria": "SUB 16", "dia": "Sábado", "hora": "14:30", "partido": "Part 6", "local": "JOCKEY TUC", "visitante": "UNI RUGBY", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 13, "cancha": "2", "categoria": "SUB 14", "dia": "Sábado", "hora": "15:20", "partido": "Part 7", "local": "TIGRES NEGRO", "visitante": "TARCOS", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 14, "cancha": "2", "categoria": "SUB 14", "dia": "Sábado", "hora": "15:20", "partido": "Part 8", "local": "SICC", "visitante": "UNI BLANCO", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 15, "cancha": "2", "categoria": "SUB 14", "dia": "Sábado", "hora": "16:10", "partido": "Part 9", "local": "UNSJ", "visitante": "UNI R VERDE", "zona": "ZONA A", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 16, "cancha": "1", "categoria": "SUB 16", "dia": "Sábado", "hora": "16:10", "partido": "Part 7", "local": "TIGRES ROJO", "visitante": "JOCKEY TUC", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 17, "cancha": "1", "categoria": "SUB 16", "dia": "Sábado", "hora": "17:00", "partido": "Part 8", "local": "TIGRES NEGRO", "visitante": "TARCOS", "zona": "ZONA A", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 18, "cancha": "1", "categoria": "SUB 16", "dia": "Sábado", "hora": "17:00", "partido": "Part 9", "local": "UNSJ", "visitante": "UNI RUGBY", "zona": "ZONA B", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },

  /* DOMINGO - DEFINICIONES */
  { "id": 19, "cancha": "1", "categoria": "SUB 14", "dia": "Domingo", "hora": "10:00", "partido": "Part 10", "local": "1A", "visitante": "2B", "zona": "ES", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 20, "cancha": "2", "categoria": "SUB 14", "dia": "Domingo", "hora": "10:00", "partido": "Part 11", "local": "1B", "visitante": "2A", "zona": "ES", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 21, "cancha": "2", "categoria": "SUB 16", "dia": "Domingo", "hora": "11:00", "partido": "Part 10", "local": "1A", "visitante": "2B", "zona": "ES", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 22, "cancha": "1", "categoria": "SUB 16", "dia": "Domingo", "hora": "11:00", "partido": "Part 11", "local": "1B", "visitante": "2A", "zona": "ES", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 23, "cancha": "1", "categoria": "SUB 16", "dia": "Domingo", "hora": "12:00", "partido": "Part 12", "local": "3A", "visitante": "3B", "zona": "5to-7mo", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 24, "cancha": "2", "categoria": "SUB 14", "dia": "Domingo", "hora": "12:00", "partido": "Part 12", "local": "3A", "visitante": "3B", "zona": "5to-7mo", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 25, "cancha": "2", "categoria": "SUB 14", "dia": "Domingo", "hora": "13:00", "partido": "Part 13", "local": "3A", "visitante": "4B", "zona": "5to-7mo", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 26, "cancha": "1", "categoria": "SUB 14", "dia": "Domingo", "hora": "13:00", "partido": "Part 13", "local": "3A", "visitante": "4B", "zona": "5to-7mo", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 27, "cancha": "1", "categoria": "SUB 16", "dia": "Domingo", "hora": "14:00", "partido": "Part 14", "local": "3B", "visitante": "4B", "zona": "5to-7mo", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 28, "cancha": "2", "categoria": "SUB 16", "dia": "Domingo", "hora": "14:00", "partido": "Part 14", "local": "3B", "visitante": "4B", "zona": "5to-7mo", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 29, "cancha": "2", "categoria": "SUB 16", "dia": "Domingo", "hora": "15:00", "partido": "Part 15", "local": "Perd part 10", "visitante": "Perd part 11", "zona": "3ero-4to", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 30, "cancha": "1", "categoria": "SUB 14", "dia": "Domingo", "hora": "15:00", "partido": "Part 15", "local": "Gan part 10", "visitante": "Gan part 11", "zona": "1ero-2do", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 31, "cancha": "2", "categoria": "SUB 14", "dia": "Domingo", "hora": "16:00", "partido": "Part 16", "local": "Perd part 10", "visitante": "Perd part 11", "zona": "3ero-4to", "jugado": false, "golesLocal": 0, "golesVisitante": 0 },
  { "id": 32, "cancha": "1", "categoria": "SUB 16", "dia": "Domingo", "hora": "16:00", "partido": "Part 16", "local": "Gan part 10", "visitante": "Gan part 11", "zona": "1ero-2do", "jugado": false, "golesLocal": 0, "golesVisitante": 0 }
] ];

async function migrarFixture() {
  const collectionRef = db.collection('partidos'); // Cambia por el nombre exacto de tu colección
  
  console.log("Eliminando fixture viejo...");
  const snapshot = await collectionRef.get();
  const batch = db.batch();
  
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  
  console.log("Cargando nuevo fixture...");
  nuevoFixture.forEach((partido) => {
    const docRef = collectionRef.doc(); // Genera ID automático o usa partido.id.toString()
    batch.set(docRef, {
      ...partido,
      fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  await batch.commit();
  console.log("¡Listo! Fixture actualizado correctamente.");
}

migrarFixture().catch(console.error);