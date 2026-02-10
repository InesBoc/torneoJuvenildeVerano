const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const partidosData = [
  // SÁBADO 14
  { id: 1, cancha: "1", categoria: "Sub 16", dia: "Sábado", hora: "09:00", partido: "Part 1", local: "SICC", visitante: "TARCOS", zona: "ZONA A", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 2, cancha: "2", categoria: "Sub 14", dia: "Sábado", hora: "09:00", partido: "Part 1", local: "UNSJ", visitante: "TIGRES ROJO", zona: "ZONA A", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 3, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "09:50", partido: "Part 2", local: "TIGRES NEGRO", visitante: "UNI BLANCO", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 4, cancha: "2", categoria: "Sub 14", dia: "Sábado", hora: "09:50", partido: "Part 3", local: "TARCOS", visitante: "SICC", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 5, cancha: "1", categoria: "Sub 16", dia: "Sábado", hora: "10:40", partido: "Part 2", local: "UNI RUGBY", visitante: "TIGRES ROJO", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 6, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "10:40", partido: "Part 3", local: "UNSJ", visitante: "JOCKEY TUC", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 7, cancha: "1", categoria: "Sub 16", dia: "Sábado", hora: "11:30", partido: "Part 4", local: "TIGRES NEGRO", visitante: "SICC", zona: "ZONA A", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 8, cancha: "2", categoria: "Sub 14", dia: "Sábado", hora: "11:30", partido: "Part 4", local: "TIGRES ROJO", visitante: "UNI R VERDE", zona: "ZONA A", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 9, cancha: "2", categoria: "Sub 14", dia: "Sábado", hora: "12:20", partido: "Part 5", local: "TIGRES NEGRO", visitante: "SICC", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 10, cancha: "1", categoria: "Sub 14", dia: "Sábado", hora: "12:20", partido: "Part 6", local: "UNI BLANCO", visitante: "TARCOS", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 11, cancha: "2", categoria: "Sub 16", dia: "Sábado", hora: "14:30", partido: "Part 5", local: "UNSJ", visitante: "TIGRES ROJO", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 12, cancha: "1", categoria: "Sub 16", dia: "Sábado", hora: "14:30", partido: "Part 6", local: "JOCKEY TUC", visitante: "UNI RUGBY", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 13, cancha: "2", categoria: "Sub 14", dia: "Sábado", hora: "15:20", partido: "Part 7", local: "TIGRES NEGRO", visitante: "TARCOS", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 14, cancha: "2", categoria: "Sub 14", dia: "Sábado", hora: "15:20", partido: "Part 8", local: "SICC", visitante: "UNI BLANCO", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 15, cancha: "2", categoria: "Sub 14", dia: "Sábado", hora: "16:10", partido: "Part 9", local: "UNSJ", visitante: "UNI R VERDE", zona: "ZONA A", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 16, cancha: "1", categoria: "Sub 16", dia: "Sábado", hora: "16:10", partido: "Part 7", local: "TIGRES ROJO", visitante: "JOCKEY TUC", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 17, cancha: "1", categoria: "Sub 16", dia: "Sábado", hora: "17:00", partido: "Part 8", local: "TIGRES NEGRO", visitante: "TARCOS", zona: "ZONA A", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 18, cancha: "1", categoria: "Sub 16", dia: "Sábado", hora: "17:00", partido: "Part 9", local: "UNSJ", visitante: "UNI RUGBY", zona: "ZONA B", jugado: false, golesLocal: 0, golesVisitante: 0 },

  // DOMINGO 15
  { id: 19, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "10:00", partido: "Part 10", local: "1° ZONA A", visitante: "2° ZONA B", zona: "Semifinal", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 20, cancha: "2", categoria: "Sub 14", dia: "Domingo", hora: "10:00", partido: "Part 11", local: "1° ZONA B", visitante: "2° ZONA A", zona: "Semifinal", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 21, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "11:00", partido: "Part 10", local: "1° ZONA A", visitante: "2° ZONA B", zona: "Semifinal", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 22, cancha: "1", categoria: "Sub 16", dia: "Domingo", hora: "11:00", partido: "Part 11", local: "1° ZONA B", visitante: "2° ZONA A", zona: "Semifinal", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 23, cancha: "1", categoria: "Sub 16", dia: "Domingo", hora: "12:00", partido: "Part 12", local: "3° ZONA A", visitante: "3° ZONA B", zona: "5to y 6to", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 24, cancha: "2", categoria: "Sub 14", dia: "Domingo", hora: "12:00", partido: "Part 12", local: "3° ZONA A", visitante: "4° ZONA B", zona: "7mo puesto", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 25, cancha: "2", categoria: "Sub 14", dia: "Domingo", hora: "13:00", partido: "Part 13", local: "3° ZONA B", visitante: "4° ZONA A", zona: "7mo puesto", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 26, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "13:00", partido: "Part 14", local: "3° ZONA A", visitante: "3° ZONA B", zona: "5to y 6to", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 27, cancha: "1", categoria: "Sub 16", dia: "Domingo", hora: "14:00", partido: "Part 13", local: "4° ZONA A", visitante: "4° ZONA B", zona: "7mo puesto", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 28, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "14:00", partido: "Part 14", local: "3° ZONA B", visitante: "4° ZONA B", zona: "5to y 6to", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 29, cancha: "2", categoria: "Sub 16", dia: "Domingo", hora: "15:00", partido: "Part 15", local: "Perdedor P10", visitante: "Perdedor P11", zona: "3er puesto", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 30, cancha: "1", categoria: "Sub 14", dia: "Domingo", hora: "15:00", partido: "Part 15", local: "Ganador P10", visitante: "Ganador P11", zona: "Final", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 31, cancha: "2", categoria: "Sub 14", dia: "Domingo", hora: "16:00", partido: "Part 16", local: "Perdedor P10", visitante: "Perdedor P11", zona: "3er puesto", jugado: false, golesLocal: 0, golesVisitante: 0 },
  { id: 32, cancha: "1", categoria: "Sub 16", dia: "Domingo", hora: "16:00", partido: "Part 16", local: "Ganador P10", visitante: "Ganador P11", zona: "Final", jugado: false, golesLocal: 0, golesVisitante: 0 }
];

async function cargarFixture() {
  const collectionRef = db.collection('partidos');

  console.log("Iniciando carga de documentos individuales...");

  for (const partido of partidosData) {
    try {
      // Creamos un documento nuevo con un ID automático para cada partido
      await collectionRef.add({
        ...partido,
        fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Cargado: ${partido.categoria} - ${partido.partido}`);
    } catch (error) {
      console.error("Error cargando partido:", error);
    }
  }

  console.log("¡Proceso finalizado con éxito!");
}

cargarFixture();