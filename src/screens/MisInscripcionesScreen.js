import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'; 
import { collection, query, onSnapshot } from 'firebase/firestore'; 
import { db, auth } from '../services/firebase';
import { globalStyles } from '../styles/globalStyles';

export default function MisInscripcionesScreen({ navigation }) { 
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
  const user = auth.currentUser;
  const uidABuscar = user ? user.uid : "anonimo";
  
  console.log("ID del usuario logueado actualmente:", uidABuscar);

  const q = query(collection(db, "inscripciones")); 

  const unsubscribe = onSnapshot(q, (snapshot) => {
    console.log("Documentos encontrados en Firebase:", snapshot.size);
    
    const docs = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log("ID del documento en Firebase:", data.usuarioId);
      return { id: doc.id, ...data };
    });

    
    const filtrados = docs.filter(d => d.usuarioId === uidABuscar);
    console.log("Documentos que coinciden con el usuario:", filtrados.length);

    setHistorial(docs); 
    setCargando(false);
  }, (error) => {
    console.error("Error de conexión a Firebase:", error);
    setCargando(false);
  });

  return () => unsubscribe();
}, []);

  if (cargando) return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#D32F2F" />
    </View>
  );

  return (
    <View style={[globalStyles.mainContainer, { flex: 1 }]}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={globalStyles.title}>Mis Inscripciones</Text>
        
        {historial.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#666' }}>No hay inscripciones aún.</Text>
          </View>
        ) : (
          historial.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.cardHistorial}
              onPress={() => navigation.navigate('DetalleInscripcion', { inscripcion: item })}
            >
              <View style={styles.headerCard}>
                <Text style={styles.clubName}>{item.club?.nombre?.toUpperCase()}</Text>
                <Text style={styles.fecha}>
                  {item.fechaInscripcion?.toDate ? item.fechaInscripcion.toDate().toLocaleDateString() : 'Reciente'}
                </Text>
              </View>
              
              <Text style={styles.ciudadText}>📍 {item.club?.ciudad}</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.labelEquipos}>Equipos Inscriptos:</Text>
              {item.equipos?.map((eq, idx) => (
                <Text key={idx} style={styles.equipoNombre}>• {eq.nombre}</Text>
              ))}

              <View style={styles.footerCard}>
                <Text style={styles.estadoText}>Estado: {item.estado}</Text>
                <View style={styles.badgeOk}>
                  <Text style={styles.badgeText}>ENVIADO</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardHistorial: { 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 15, 
    marginVertical: 10, 
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 6, 
    borderLeftColor: '#D32F2F' 
  },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubName: { fontSize: 18, fontWeight: 'bold', color: '#000', flex: 1 },
  fecha: { fontSize: 12, color: '#888' },
  ciudadText: { fontSize: 14, color: '#666', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  labelEquipos: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F', marginBottom: 5 },
  equipoNombre: { fontSize: 15, color: '#333', marginBottom: 3, paddingLeft: 5 },
  footerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  estadoText: { fontSize: 14, color: '#27ae60', fontWeight: 'bold' },
  badgeOk: { backgroundColor: '#2e7d32', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' }
});