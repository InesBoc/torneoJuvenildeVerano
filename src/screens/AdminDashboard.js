import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';

export default function AdminDashboard() {
  const navigation = useNavigation();
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
          <View>
            <TouchableOpacity 
              style={styles.btnIrFixture}
              onPress={() => navigation.navigate('AdminFixture')}
            >
              <Text style={styles.btnIrFixtureText}>🏑 GESTIONAR RESULTADOS Y GOLES</Text>
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerText}>
                Total de inscripciones: <Text style={{ fontWeight: 'bold' }}>{inscripciones.length}</Text>
              </Text>
            </View>
          </View>
        }
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnIrFixture: {
    backgroundColor: '#333',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    elevation: 3
  },
  btnIrFixtureText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerInfo: { padding: 20, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#eee', marginTop: 10 },
  headerText: { fontSize: 16, color: '#333' },
  adminCard: { backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 10, padding: 15, borderRadius: 12, elevation: 5, paddingBottom: 80 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  badgeEstado: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  infoAdmin: { color: '#666', marginTop: 5, fontSize: 14 },
  actionRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' },
  btnComprobante: { borderBottomWidth: 1, borderColor: '#3498db' },
  btnLinkText: { color: '#3498db', fontWeight: 'bold' },
  btnStatus: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnStatusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});