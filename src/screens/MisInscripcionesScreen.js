import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'; 
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { globalStyles } from '../styles/globalStyles';

export default function MisInscripcionesScreen({ navigation }) { 
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      const user = auth.currentUser;
      
      const uidABuscar = user ? user.uid : "anonimo";

      try {
        console.log("Cargando inscripciones para:", uidABuscar);
        const q = query(
          collection(db, "inscripciones"), 
          where("usuarioId", "==", uidABuscar)
        );

        const querySnapshot = await getDocs(q);
        const listaTemporal = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        listaTemporal.sort((a, b) => b.fechaInscripcion - a.fechaInscripcion);

        setHistorial(listaTemporal);
      } catch (error) {
        console.error("Error cargando historial", error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarHistorial();
  }, []);

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#D32F2F" />;

  return (
    <View style={[globalStyles.mainContainer, { flex: 1 }]}>
      <Text style={globalStyles.title}>Mis Inscripciones</Text>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.cardHistorial}
            onPress={() => navigation.navigate('DetalleInscripcion', { inscripcion: item })}
          >
            <View style={styles.headerCard}>
              <Text style={styles.clubName}>{item.club?.nombre?.toUpperCase() || 'CLUB SIN NOMBRE'}</Text>
              <Text style={styles.fecha}>
                {item.fechaInscripcion?.toDate ? item.fechaInscripcion.toDate().toLocaleDateString() : 'Pendiente'}
              </Text>
            </View>
            
            <Text style={styles.ciudadText}>📍 {item.club?.ciudad}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.labelEquipos}>Equipos Inscriptos:</Text>
            {item.equipos?.map((equipo, index) => (
              <Text key={index} style={styles.equipoNombre}>
                • {equipo.nombre}
              </Text>
            ))}

            <View style={styles.footerCard}>
              <Text style={styles.estadoText}>Estado: {item.estado}</Text>
              <View style={styles.badgeOk}>
                <Text style={styles.badgeText}>ENVIADO</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
            No tienes inscripciones previas.
          </Text>
        }
      />
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