import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
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
  const [tempNombres, setTempNombres] = useState({}); 

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

  const vincularEquipoIndiv = async (inscripcion, equipoIndex, textoInput) => {
    const nombreAFijar = (textoInput !== undefined) ? textoInput : inscripcion.equipos[equipoIndex].nombreFixture;
    
    if (!nombreAFijar || nombreAFijar.trim() === "") {
      Alert.alert("Atención", "Escribe el nombre del equipo tal cual aparece en el fixture.");
      return;
    }

    try {
      const nuevosEquipos = [...inscripcion.equipos];
      nuevosEquipos[equipoIndex] = {
        ...nuevosEquipos[equipoIndex],
        nombreFixture: nombreAFijar.trim()
      };

      await updateDoc(doc(db, "inscripciones", inscripcion.id), { 
        equipos: nuevosEquipos 
      });
      
      Alert.alert("✅ Vinculado", `El equipo ahora se identifica como: ${nombreAFijar.trim()}`);
      
      const inputKey = `${inscripcion.id}-${equipoIndex}`;
      const nuevosTemporales = { ...tempNombres };
      delete nuevosTemporales[inputKey];
      setTempNombres(nuevosTemporales);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar la vinculación.");
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
                Clubes inscriptos: <Text style={{ fontWeight: 'bold' }}>{inscripciones.length}</Text>
              </Text>
            </View>
          </View>
        }
        renderItem={({ item: inscripcion }) => (
          <View style={styles.adminCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.clubTitle}>{inscripcion.club?.nombre}</Text>
              <View style={[styles.badge, {backgroundColor: inscripcion.estado === 'Aprobada' ? '#2e7d32' : '#ffa000'}]}>
                <Text style={styles.badgeText}>{inscripcion.estado}</Text>
              </View>
            </View>
            
            <View style={styles.mappingSection}>
              <Text style={styles.labelMapping}>VINCULAR CON NOMBRE DE FIXTURE:</Text>
              
              {inscripcion.equipos?.map((eq, index) => {
                const inputKey = `${inscripcion.id}-${index}`;
                const yaVinculado = eq.nombreFixture && eq.nombreFixture.length > 0;
                const valorMostrar = tempNombres[inputKey] !== undefined 
                                    ? tempNombres[inputKey] 
                                    : (eq.nombreFixture || "");

                return (
                  <View key={index} style={styles.equipoVinculoRow}>
                    <Text style={styles.txtCategoria}>Inscripto como: {eq.nombre}</Text>
                    <View style={styles.rowMapping}>
                      <TextInput 
                        style={[
                          styles.inputMapping, 
                          yaVinculado && { borderColor: '#2e7d32', backgroundColor: '#f0fdf4' }
                        ]}
                        placeholder="Nombre exacto en Fixture"
                        value={valorMostrar}
                        onChangeText={(text) => setTempNombres({ ...tempNombres, [inputKey]: text })} 
                      />
                      <TouchableOpacity 
                        style={[
                          styles.btnVinculoMini, 
                          { backgroundColor: yaVinculado ? '#2e7d32' : '#333' }
                        ]}
                        onPress={() => vincularEquipoIndiv(inscripcion, index, tempNombres[inputKey])}
                      >
                        <Text style={styles.btnStatusText}>
                          {yaVinculado ? "ACTUALIZAR" : "VINCULAR"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {yaVinculado && (
                      <Text style={{fontSize: 9, color: '#2e7d32', marginTop: 4, fontWeight: 'bold'}}>
                        ✓ VINCULADO CORRECTAMENTE
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              <Text style={{fontSize: 12, color: '#666'}}>Ciudad: {inscripcion.club?.ciudad}</Text>
              <TouchableOpacity 
                style={[styles.btnStatus, { backgroundColor: inscripcion.estado === 'Aprobada' ? '#666' : '#2e7d32' }]} 
                onPress={() => cambiarEstado(inscripcion.id, inscripcion.estado === 'Aprobada' ? 'Pendiente' : 'Aprobada')}
              >
                <Text style={styles.btnStatusText}>
                  {inscripcion.estado === 'Aprobada' ? 'Pasar a Pendiente' : 'Aprobar Club'}
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
  clubTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  btnStatus: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnStatusText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  mappingSection: { marginTop: 15 },
  labelMapping: { fontSize: 10, fontWeight: 'bold', color: '#666', marginBottom: 8, letterSpacing: 1 },
  txtCategoria: { fontSize: 11, color: '#888', marginBottom: 4 },
  equipoVinculoRow: { marginBottom: 12, backgroundColor: '#fdfdfd', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  inputMapping: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 5, flex: 1, fontSize: 13, borderWidth: 1, borderColor: '#ccc', color: '#333' },
  rowMapping: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnVinculoMini: { backgroundColor: '#D32F2F', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 }
});