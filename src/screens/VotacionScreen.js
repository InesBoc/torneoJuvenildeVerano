import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  TextInput, ActivityIndicator, Modal 
} from 'react-native';
import { db } from '../services/firebase';
import { 
  collection, getDocs, doc, getDoc, 
  writeBatch, increment 
} from 'firebase/firestore'; 
import { globalStyles } from '../styles/globalStyles';

const VotacionScreen = () => {
  const [loading, setLoading] = useState(true);
  const [todasLasJugadoras, setTodasLasJugadoras] = useState([]);
  const [jugadorasFiltradas, setJugadorasFiltradas] = useState([]);
  const [categoriaSel, setCategoriaSel] = useState('Sub 14');
  const [busqueda, setBusqueda] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadoraParaVotar, setJugadoraParaVotar] = useState(null);
  const [codigoAcceso, setCodigoAcceso] = useState('');

  useEffect(() => {
    cargarJugadoras();
  }, []);

  const cargarJugadoras = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "inscripciones"));
      let listaTmp = [];

      querySnapshot.forEach((docSnap) => {
        const datos = docSnap.data();
        const clubNom = datos.club?.nombre || "Club";
        
        if (datos.equipos) {
          datos.equipos.forEach(eq => {
            const catEq = eq.categoria || (eq.id?.includes("Sub14") ? "Sub 14" : "Sub 16");
            
            if (eq.jugadoras) {
              eq.jugadoras.forEach(j => {
                listaTmp.push({
                  ...j,
                  dorsal: j.dorsal || j.numero || "-", // <--- AGREGADO: Capturamos el dorsal
                  clubNombre: clubNom,
                  categoria: catEq,
                  idUnico: j.dni || `${j.apellido}-${j.nombre}-${clubNom}`
                });
              });
            }
          });
        }
      });

      setTodasLasJugadoras(listaTmp);
      setJugadorasFiltradas(listaTmp.filter(j => j.categoria === 'Sub 14'));
      setLoading(false);
    } catch (e) {
      console.error("Error al cargar jugadoras:", e);
      setLoading(false);
    }
  };

  const filtrar = (texto) => {
    setBusqueda(texto);
    const res = todasLasJugadoras.filter(j => 
      j.categoria === categoriaSel && 
      (`${j.nombre} ${j.apellido} ${j.clubNombre}`.toLowerCase().includes(texto.toLowerCase()))
    );
    setJugadorasFiltradas(res);
  };

  const cambiarCat = (cat) => {
    setCategoriaSel(cat);
    const res = todasLasJugadoras.filter(j => j.categoria === cat);
    setJugadorasFiltradas(res);
  };

  const confirmarVotacion = async () => {
    if (!codigoAcceso.trim()) return alert("Ingresa el código");
    setLoading(true);
    
    try {
      const codLimpio = codigoAcceso.trim().toUpperCase();
      const docRef = doc(db, "codigos_votos", codLimpio);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        setLoading(false);
        return alert("El código no existe.");
      }

      const dataCod = snap.data();
      const campoVoto = jugadoraParaVotar.categoria === 'Sub 14' ? 'votoSub14' : 'votoSub16';

      if (dataCod[campoVoto]) {
        setLoading(false);
        setModalVisible(false);
        return alert(`Este club ya votó para ${jugadoraParaVotar.categoria}`);
      }

      const batch = writeBatch(db);
      const rankingRef = doc(db, "ranking_votos", jugadoraParaVotar.idUnico);
      
      batch.set(rankingRef, {
        nombreCompleto: `${jugadoraParaVotar.apellido}, ${jugadoraParaVotar.nombre}`,
        club: jugadoraParaVotar.clubNombre,
        categoria: jugadoraParaVotar.categoria,
        dorsal: jugadoraParaVotar.dorsal, // <--- También lo guardamos en el ranking
        votos: increment(1)
      }, { merge: true });

      batch.update(docRef, { [campoVoto]: true });
      await batch.commit();

      setModalVisible(false);
      setCodigoAcceso('');
      setLoading(false);
      alert("¡Voto procesado!");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.mainContainer}>
      <Text style={styles.title}>Mejor Jugadora del Torneo</Text>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => cambiarCat('Sub 14')} 
          style={[styles.tab, categoriaSel === 'Sub 14' && styles.tabActive]}
        >
          <Text style={categoriaSel === 'Sub 14' ? styles.tabTextActive : styles.tabText}>Sub 14</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => cambiarCat('Sub 16')} 
          style={[styles.tab, categoriaSel === 'Sub 16' && styles.tabActive]}
        >
          <Text style={categoriaSel === 'Sub 16' ? styles.tabTextActive : styles.tabText}>Sub 16</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        placeholder="Buscar por nombre o club..." 
        style={styles.search} 
        value={busqueda}
        onChangeText={filtrar} 
      />

      <FlatList
        data={jugadorasFiltradas}
        keyExtractor={item => item.idUnico}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>No hay jugadoras cargadas.</Text>}
        renderItem={({item}) => (
          <View style={styles.card}>
            {/* Círculo para el Dorsal */}
            <View style={styles.dorsalBadge}>
              <Text style={styles.dorsalText}>{item.dorsal}</Text>
            </View>
            
            <View style={{flex: 1}}>
              <Text style={styles.nombre}>{item.apellido}, {item.nombre}</Text>
              <Text style={styles.clubSub}>{item.clubNombre}</Text>
            </View>

            <TouchableOpacity 
              style={styles.btnVotar} 
              onPress={() => { setJugadoraParaVotar(item); setModalVisible(true); }}
            >
              <Text style={styles.btnVotarText}>VOTAR</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Voto</Text>
            <Text style={{textAlign:'center'}}>
                Vas a votar a la jugadora #{jugadoraParaVotar?.dorsal}: {"\n"}
                <Text style={{fontWeight:'bold'}}>{jugadoraParaVotar?.nombre} {jugadoraParaVotar?.apellido}</Text>
            </Text>
            
            <TextInput 
              placeholder="CÓDIGO DE CLUB" 
              style={styles.inputCodigo} 
              value={codigoAcceso} 
              onChangeText={setCodigoAcceso} 
              autoCapitalize="characters" 
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancelar}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmarVotacion} style={styles.btnConfirmar}>
                <Text style={{color:'#fff', fontWeight:'bold'}}>Enviar Voto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', color: '#D32F2F', textAlign: 'center', marginVertical: 15 },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 15, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#D32F2F' },
  tab: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  tabActive: { backgroundColor: '#D32F2F' },
  tabText: { color: '#D32F2F', fontWeight: 'bold' },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
  search: { backgroundColor: '#f0f0f0', marginHorizontal: 20, padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ccc' },
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 5, padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  
  // Estilo del Dorsal
  dorsalBadge: { backgroundColor: '#eee', width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  dorsalText: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  
  nombre: { fontSize: 16, fontWeight: 'bold' },
  clubSub: { fontSize: 13, color: '#666' },
  btnVotar: { backgroundColor: '#FFD700', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6 },
  btnVotarText: { fontWeight: 'bold', fontSize: 12 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '85%', padding: 25, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  inputCodigo: { borderBottomWidth: 2, borderColor: '#D32F2F', width: '100%', marginVertical: 20, fontSize: 22, textAlign: 'center', letterSpacing: 3, fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  btnCancelar: { flex: 1, padding: 12, alignItems: 'center' },
  btnConfirmar: { flex: 2, backgroundColor: '#D32F2F', padding: 12, borderRadius: 8, alignItems: 'center' }
});

export default VotacionScreen;