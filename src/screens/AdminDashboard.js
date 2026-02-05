import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Linking, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tempNombres, setTempNombres] = useState({}); // Para manejar los inputs individuales

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

  // NUEVA FUNCIÓN: Vincula un equipo específico dentro del array
  const vincularEquipoIndiv = async (inscripcion, equipoIndex, nuevoNombre) => {
    if (!nuevoNombre) {
      Alert.alert("Atención", "Escribe el nombre como figura en el fixture");
      return;
    }

    try {
      const nuevosEquipos = [...inscripcion.equipos];
      // Actualizamos el campo nombreFixture SOLO para este equipo del array
      nuevosEquipos[equipoIndex] = {
        ...nuevosEquipos[equipoIndex],
        nombreFixture: nuevoNombre.trim()
      };

      await updateDoc(doc(db, "inscripciones", inscripcion.id), { 
        equipos: nuevosEquipos 
      });
      
      Alert.alert("Éxito", "Equipo vinculado correctamente");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo vincular el equipo");
    }
  };

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
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <TouchableOpacity 
              style={styles.btnIrFixture}
              onPress={() => navigation.navigate('AdminFixture')}
            >
              <Text style={styles.btnIrFixtureText}>🏑 GESTIONAR RESULTADOS Y PLANILLAS</Text>
            </TouchableOpacity>

            <View style={styles.headerInfo}>
              <Text style={styles.headerText}>
                Total de inscripciones: <Text style={{ fontWeight: 'bold' }}>{inscripciones.length}</Text>
              </Text>
            </View>
          </View>
        }
        renderItem={({ item: inscripcion }) => (
          <View style={styles.adminCard}>
            <Text style={styles.clubTitle}>{inscripcion.club?.nombre}</Text>
            <Text style={{fontSize: 10, color: '#999', marginBottom: 10}}>ID: {inscripcion.id}</Text>
            
            <View style={styles.mappingSection}>
              <Text style={styles.labelMapping}>EQUIPOS INSCRIPTOS (Vincular cada uno):</Text>
              
              {inscripcion.equipos?.map((eq, index) => {
                const inputKey = `${inscripcion.id}-${index}`;
                return (
                  <View key={index} style={styles.equipoVinculoRow}>
                    <View style={{flex: 1}}>
                      <Text style={styles.txtCategoria}>{eq.categoria} - {eq.nombre}</Text>
                      <View style={styles.rowMapping}>
                        <TextInput 
                          style={styles.inputMapping}
                          placeholder="Nombre en Fixture (ej: Tigres A)"
                          defaultValue={eq.nombreFixture || ""}
                          onChangeText={(text) => setTempNombres({ ...tempNombres, [inputKey]: text })} 
                        />
                        <TouchableOpacity 
                          style={styles.btnVinculoMini}
                          onPress={() => vincularEquipoIndiv(inscripcion, index, tempNombres[inputKey] || eq.nombreFixture)}
                        >
                          <Text style={styles.btnStatusText}>OK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.btnComprobante} 
                onPress={() => Linking.openURL(inscripcion.comprobanteUrl)}
              >
                <Text style={styles.btnLinkText}>Ver Pago 📄</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btnStatus, { backgroundColor: inscripcion.estado === 'Aprobada' ? '#2e7d32' : '#ffa000' }]} 
                onPress={() => cambiarEstado(inscripcion.id, inscripcion.estado === 'Aprobada' ? 'Pendiente' : 'Aprobada')}
              >
                <Text style={styles.btnStatusText}>
                  {inscripcion.estado === 'Aprobada' ? 'Aprobado ✅' : 'Aprobar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btnIrFixture: { backgroundColor: '#333', padding: 15, marginHorizontal: 20, marginTop: 10, borderRadius: 10, elevation: 3 },
  btnIrFixtureText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  headerInfo: { padding: 20, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#eee', marginTop: 10 },
  headerText: { fontSize: 16, color: '#333' },
  adminCard: { backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 10, padding: 15, borderRadius: 12, elevation: 5 },
  clubTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  actionRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  btnComprobante: { borderBottomWidth: 1, borderColor: '#3498db' },
  btnLinkText: { color: '#3498db', fontWeight: 'bold' },
  btnStatus: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnStatusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  
  mappingSection: { marginTop: 5 },
  labelMapping: { fontSize: 11, fontWeight: 'bold', color: '#D32F2F', marginBottom: 8 },
  txtCategoria: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 4 },
  equipoVinculoRow: { marginBottom: 12, backgroundColor: '#f9f9f9', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  inputMapping: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5, flex: 1, fontSize: 12, borderWidth: 1, borderColor: '#ccc' },
  rowMapping: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  btnVinculoMini: { backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 }
});