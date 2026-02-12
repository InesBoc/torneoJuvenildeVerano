const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const partidosData = [
  // SÁBADO - SUB 14
  { id: 1, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "09:00", partido: "1", local: "TIGRES NEGRO", visitante: "UNI BLANCO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 2, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "10:00", partido: "2", local: "UNI R VERDE", visitante: "SICC", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 3, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "11:00", partido: "3", local: "UNSJ", visitante: "TARCOS", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 4, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "12:00", partido: "4", local: "TIGRES NEGRO", visitante: "UNI R VERDE", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 5, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "14:00", partido: "5", local: "UNSJ", visitante: "UNI BLANCO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 6, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "15:00", partido: "6", local: "TARCOS", visitante: "SICC", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 7, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "16:00", partido: "7", local: "UNSJ", visitante: "UNI R VERDE", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 8, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "17:00", partido: "8", local: "UNI BLANCO", visitante:"TARCOS" , zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 9, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "18:00", partido: "9", local: "SICC", visitante: "TIGRES NEGRO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },

  // SÁBADO - SUB 16
  { id: 10, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "09:00", partido: "1", local: "UNSJ", visitante: "UNI RUGBY", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 11, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "10:00", partido: "2", local: "TIGRES ROJO", visitante: "TARCOS", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 12, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "11:00", partido: "3", local: "TIGRES NEGRO", visitante: "JOCKEY TUC", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 13, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "12:00", partido: "4", local: "UNSJ", visitante: "TIGRES ROJO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 14, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "14:00", partido: "5", local: "TIGRES NEGRO", visitante: "UNI RUGBY", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 15, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "15:00", partido: "6", local: "JOCKEY TUC", visitante: "TARCOS", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 16, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "16:00", partido: "7", local: "TIGRES NEGRO", visitante: "TIGRES ROJO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 17, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "17:00", partido: "8", local: "UNI RUGBY", visitante: "JOCKEY TUC", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 18, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "18:00", partido: "9", local:  "TARCOS",visitante:"UNSJ", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },

  // DOMINGO - SUB 14
  { id: 19, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "10:00", partido: "10", local: "UNSJ", visitante: "SICC", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 20, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "11:00", partido: "11", local: "UNI BLANCO", visitante: "UNI R VERDE", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 21, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "12:00", partido: "12", local: "TARCOS", visitante: "TIGRES NEGRO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 22, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "13:00", partido: "13", local: "SICC", visitante: "UNI BLANCO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 23, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "14:00", partido: "14", local: "UNI R VERDE", visitante: "TARCOS", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 24, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "15:00", partido: "15", local: "UNSJ", visitante: "TIGRES NEGRO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },

  // DOMINGO - SUB 16
  { id: 25, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "10:00", partido: "10", local: "TIGRES NEGRO", visitante: "TARCOS", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 26, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "11:00", partido: "11", local: "UNI RUGBY", visitante: "TIGRES ROJO", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 27, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "12:00", partido: "12", local: "JOCKEY TUC", visitante: "UNSJ", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 28, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "13:00", partido: "13", local: "TARCOS", visitante: "UNI RUGBY", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 29, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "14:00", partido: "14", local: "TIGRES ROJO", visitante: "JOCKEY TUC", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 30, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "15:00", partido: "15", local: "TIGRES NEGRO", visitante: "UNSJ", zona: "ÚNICA", jugado: false, golesLocal: 0, golesVisitante: 0 }
];

async function cargarFixture() {
  const collectionRef = db.collection('partidos');

  console.log("Limpiando colección anterior...");
  const snapshot = await collectionRef.get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log("Cargando nuevos datos...");
  for (const p of partidosData) {
    await collectionRef.doc(p.id.toString()).set({
      ...p,
      fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Cargado: ID ${p.id} - Part ${p.partido} (${p.categoria})`);
  }
  console.log("¡Listo!");
  process.exit();
}

cargarFixture();