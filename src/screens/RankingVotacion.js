import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { db } from '../services/firebase';
import { 
  collection, query, orderBy, onSnapshot 
} from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';

const RankingVotacion = () => {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Sub 14');

  useEffect(() => {
    // Escuchamos los cambios en tiempo real
    const q = query(
      collection(db, "ranking_votos"), 
      orderBy("votos", "desc") // Ordenar por cantidad de votos
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRanking(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error en ranking:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtramos el ranking según la categoría seleccionada
  const datosFiltrados = ranking.filter(j => j.categoria === categoriaFiltro);

  if (loading) {
    return <ActivityIndicator size="large" color="#D32F2F" style={{flex:1}} />;
  }

  return (
    <View style={globalStyles.mainContainer}>
      <Text style={styles.title}>Resultados de Votación</Text>

      {/* Selector de Categoría */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          onPress={() => setCategoriaFiltro('Sub 14')} 
          style={[styles.tab, categoriaFiltro === 'Sub 14' && styles.tabActive]}
        >
          <Text style={categoriaFiltro === 'Sub 14' ? styles.tabTextActive : styles.tabText}>Sub 14</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setCategoriaFiltro('Sub 16')} 
          style={[styles.tab, categoriaFiltro === 'Sub 16' && styles.tabActive]}
        >
          <Text style={categoriaFiltro === 'Sub 16' ? styles.tabTextActive : styles.tabText}>Sub 16</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={datosFiltrados}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Aún no hay votos registrados.</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.rankingCard}>
            <View style={styles.posicionContainer}>
              <Text style={styles.posicionText}>#{index + 1}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.nombre}>{item.nombreCompleto}</Text>
              <Text style={styles.club}>{item.club}</Text>
            </View>
            <View style={styles.votosContainer}>
              <Text style={styles.votosNumero}>{item.votos}</Text>
              <Text style={styles.votosLabel}>votos</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', color: '#D32F2F', textAlign: 'center', marginVertical: 20 },
  tabBar: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 15, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#D32F2F' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#D32F2F' },
  tabText: { color: '#D32F2F', fontWeight: 'bold' },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
  rankingCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    marginHorizontal: 20, 
    marginVertical: 5, 
    borderRadius: 10, 
    padding: 15, 
    alignItems: 'center',
    elevation: 3 
  },
  posicionContainer: { backgroundColor: '#FFD700', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  posicionText: { fontWeight: 'bold', color: '#000' },
  infoContainer: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: 'bold' },
  club: { fontSize: 13, color: '#666' },
  votosContainer: { alignItems: 'center' },
  votosNumero: { fontSize: 20, fontWeight: 'bold', color: '#D32F2F' },
  votosLabel: { fontSize: 10, color: '#666' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default RankingVotacion;