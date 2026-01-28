import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';

export default function AdminFixtureScreen() {
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categoria, setCategoria] = useState('Sub 14');
  const [editando, setEditando] = useState({});
  const [zona, setZona] = useState('A');

  useEffect(() => {
    setCargando(true);
    const q = query(
      collection(db, "partidos"),
      where("categoria", "==", categoria),
      where("zona", "==", zona)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPartidos(docs.sort((a, b) => Number(a.partido) - Number(b.partido)));
      setCargando(false);
    });
    return () => unsubscribe();
  }, [categoria, zona]);

  const handleGuardar = async (partido) => {
    if (!partido.id) return;

    const gL = editando[partido.id]?.golesLocal !== undefined ? editando[partido.id].golesLocal : partido.golesLocal;
    const gV = editando[partido.id]?.golesVisitante !== undefined ? editando[partido.id].golesVisitante : partido.golesVisitante;

    try {
      const partidoRef = doc(db, "partidos", partido.id);
      await updateDoc(partidoRef, {
        golesLocal: parseInt(gL) || 0,
        golesVisitante: parseInt(gV) || 0,
        jugado: true
      });
      Alert.alert("Guardado", "✅ Resultado actualizado");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const renderPartido = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.headerCard}>Partido N° {item.partido}</Text>
      <View style={styles.row}>
        <View style={styles.equipoCont}>
          <Text style={styles.equipoNombre}>{item.local}</Text>
          <TextInput
            style={styles.inputGoles}
            keyboardType="numeric"
            placeholder={item.golesLocal?.toString() || "0"}
            onChangeText={(val) => setEditando({
              ...editando,
              [item.id]: { ...editando[item.id], golesLocal: val }
            })}
          />
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.equipoCont}>
          <TextInput
            style={styles.inputGoles}
            keyboardType="numeric"
            placeholder={item.golesVisitante?.toString() || "0"}
            onChangeText={(val) => setEditando({
              ...editando,
              [item.id]: { ...editando[item.id], golesVisitante: val }
            })}
          />
          <Text style={styles.equipoNombre}>{item.visitante}</Text>
        </View>

        <TouchableOpacity style={styles.btnGuardar} onPress={() => handleGuardar(item)}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.mainContainer}>
  
      <View style={styles.selector}>
        {['Sub 14', 'Sub 16'].map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.btnCat, categoria === cat && styles.btnCatActive]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={[styles.txtCat, categoria === cat && styles.txtCatActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.selector}>
        {['A', 'B', 'Definición'].map(z => (
          <TouchableOpacity
            key={z}
            style={[styles.btnCat, zona === z && { backgroundColor: '#333' }]}
            onPress={() => setZona(z)}
          >
            <Text style={[styles.txtCat, zona === z && { color: '#fff' }]}>Zona {z}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={partidos}
          keyExtractor={item => item.id}
          renderItem={renderPartido}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay partidos en esta zona</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 10, marginBottom: 8, borderRadius: 10, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  equipoCont: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  inputGoles: { backgroundColor: '#f0f0f0', width: 35, height: 35, textAlign: 'center', borderRadius: 5, marginHorizontal: 5 },
  equipoNombre: { fontSize: 13, width: 70, textAlign: 'center', fontWeight: 'bold' },
  btnGuardar: { backgroundColor: '#2e7d32', padding: 10, borderRadius: 5, marginLeft: 10 },
  vs: { fontWeight: 'bold', fontSize: 10 },
  selector: { flexDirection: 'row', marginBottom: 5 },
  btnCat: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#eee', borderWidth: 0.5, borderColor: '#ccc' },
  btnCatActive: { backgroundColor: '#D32F2F' },
  txtCat: { color: '#333', fontSize: 12 },
  txtCatActive: { color: '#fff', fontWeight: 'bold' },
  headerCard: { fontSize: 11, color: '#999', textAlign: 'center' }
});