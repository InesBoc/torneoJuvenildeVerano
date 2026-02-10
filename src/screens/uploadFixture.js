const admin = require('firebase-admin');
const serviceAccount = require('./tu-llave-privada.json'); // Descárgala de la consola de Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const nuevoFixture = [ /* PEGA AQUÍ EL JSON DEL PASO 1 */ ];

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