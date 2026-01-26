import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Linking, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';

export default function AdminDashboard() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "inscripciones"), orderBy("fechaInscripcion", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setInscripciones(docs);
      setCargando(false);
    }, (error) => {
      console.error("Error en Snapshot:", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "inscripciones", id), { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  if (cargando) {
    return (
      <View style={[globalStyles.mainContainer, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={globalStyles.mainContainer}>
      <Text style={[globalStyles.title, { margin: 20 }]}>Panel de Control</Text>
      
      <FlatList
        data={inscripciones}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <Text style={styles.headerText}>
              Total de inscripciones: <Text style={{ fontWeight: 'bold' }}>{inscripciones.length}</Text>
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View style={styles.adminCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.clubTitle}>{item.club?.nombre || 'S/N'}</Text>
              <View style={[
                styles.badgeEstado, 
                { backgroundColor: item.estado === 'Aprobada' ? '#2e7d32' : '#f1c40f' }
              ]}>
                <Text style={styles.badgeText}>{item.estado?.toUpperCase()}</Text>
              </View>
            </View>
            
            <Text style={styles.infoAdmin}>📍 {item.club?.ciudad}</Text>
            
            <View style={styles.equipoListAdmin}>
              <Text style={styles.subSubtitle}>Equipos Registrados:</Text>
              {item.equipos?.map((eq, i) => (
                <Text key={i} style={styles.eqItem}>• {eq.nombre}</Text>
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.btnComprobante} 
                onPress={() => Linking.openURL(item.comprobanteUrl)}
              >
                <Text style={styles.btnLinkText}>Ver Pago 📄</Text>
              </TouchableOpacity>
              
              {item.estado !== 'Aprobada' && (
                <TouchableOpacity 
                  style={[styles.btnStatus, { backgroundColor: '#2e7d32' }]} 
                  onPress={() => cambiarEstado(item.id, 'Aprobada')}
                >
                  <Text style={styles.btnStatusText}>Aprobar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay inscripciones registradas.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerInfo: { 
    padding: 20, 
    backgroundColor: '#f8f9fa', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  headerText: { fontSize: 16, color: '#333' },
  adminCard: { 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    marginVertical: 10, 
    padding: 15, 
    borderRadius: 12, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  badgeEstado: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  infoAdmin: { color: '#666', marginTop: 5, fontSize: 14 },
  equipoListAdmin: { marginTop: 10, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
  subSubtitle: { fontWeight: 'bold', fontSize: 12, color: '#D32F2F', marginBottom: 5 },
  eqItem: { fontSize: 14, color: '#333' },
  actionRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' },
  btnComprobante: { borderBottomWidth: 1, borderColor: '#3498db' },
  btnLinkText: { color: '#3498db', fontWeight: 'bold' },
  btnStatus: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnStatusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});