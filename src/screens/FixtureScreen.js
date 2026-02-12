import React, { useEffect, useState } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  ActivityIndicator,
  useWindowDimensions, 
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { db } from '../services/firebase'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import SponsorCarousel from '../components/SponsorCarousel';

const FixtureScreen = () => {
  const [categoriaVisible, setCategoriaVisible] = useState('Sub 14');
  const [partidos, setPartidos] = useState([]);
  const [posiciones, setPosiciones] = useState([]); // Ahora es un array simple
  const [cargando, setCargando] = useState(true);

  const { height } = useWindowDimensions();

  useEffect(() => {
    setCargando(true);
    const q = query(collection(db, "partidos"), where("categoria", "==", categoriaVisible));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenar por el número de partido (campo "partido" que ahora es un string "1", "2", etc.)
      const docsOrdenados = docs.sort((a, b) => {
        const numA = parseInt(a.partido) || 0;
        const numB = parseInt(b.partido) || 0;
        return numA - numB;
      });
      
      setPartidos(docsOrdenados);
      calcularPosiciones(docsOrdenados); 
      setCargando(false);
    });
    return () => unsubscribe();
  }, [categoriaVisible]);

  const calcularPosiciones = (datosPartidos) => {
    const stats = {};
    
    datosPartidos.forEach(p => {
      if (!p.jugado) return; // Solo procesar si el partido ya se jugó

      [p.local, p.visitante].forEach(eq => {
        if (!stats[eq]) {
          stats[eq] = { equipo: eq, pj: 0, pts: 0, gf: 0, gc: 0, dg: 0 };
        }
      });

      const loc = stats[p.local];
      const vis = stats[p.visitante];

      loc.pj += 1; vis.pj += 1;
      loc.gf += Number(p.golesLocal || 0); 
      loc.gc += Number(p.golesVisitante || 0);
      vis.gf += Number(p.golesVisitante || 0); 
      vis.gc += Number(p.golesLocal || 0);

      if (Number(p.golesLocal) > Number(p.golesVisitante)) loc.pts += 3;
      else if (Number(p.golesVisitante) > Number(p.golesLocal)) vis.pts += 3;
      else { loc.pts += 1; vis.pts += 1; }

      loc.dg = loc.gf - loc.gc;
      vis.dg = vis.gf - vis.gc;
    });

    // Convertir objeto a array y ordenar por puntos y diferencia de gol
    const tablaOrdenada = Object.values(stats).sort((a, b) => b.pts - a.pts || b.dg - a.dg);
    setPosiciones(tablaOrdenada);
  };

  const descargarPDF = () => {
    const urlPdf = 'https://drive.google.com/file/d/1qEnsX7SKrXt7oljvLU5N4yu6_9HjhLb3/view?usp=sharing';
    Linking.openURL(urlPdf).catch(err => console.error("Error al abrir PDF", err));
  };

  return (
    <View style={{ flex: 1, height: height, backgroundColor: '#fff' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 100 }}>

        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={globalStyles.scrollContent}>
            
            <TouchableOpacity style={styles.btnPdf} onPress={descargarPDF}>
              <Text style={styles.btnPdfText}>📄 DESCARGAR REGLAMENTO (PDF)</Text>
            </TouchableOpacity>

            <View style={styles.selectorContainer}>
              {['Sub 14', 'Sub 16'].map(cat => (
                <TouchableOpacity 
                  key={cat}
                  style={[styles.btnSelector, categoriaVisible === cat && styles.btnActive]}
                  onPress={() => setCategoriaVisible(cat)}
                >
                  <Text style={[styles.textSelector, categoriaVisible === cat && styles.textActive]}>{cat.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {cargando ? (
              <ActivityIndicator size="large" color="#D32F2F" />
            ) : (
              <>
                {/* --- SECCIÓN 1: FIXTURE COMPLETO --- */}
                <Text style={styles.tituloSeccion}>Fixture {categoriaVisible}</Text>
                {partidos.map((item) => (
                  <View key={item.id} style={[styles.tarjetaPartido, { borderLeftWidth: 5, borderLeftColor: item.dia === 'Sábado' ? '#D32F2F' : '#000' }]}>
                    <View style={styles.infoHora}>
                      <Text style={{ fontSize: 10, color: '#666', fontWeight: 'bold' }}>{item.dia.toUpperCase()}</Text>
                      <Text style={styles.horaText}>{item.hora}</Text>  
                      <Text style={styles.canchaText}>Cancha {item.cancha}</Text>
                      <Text style={[styles.canchaText, { color: '#D32F2F', fontWeight: 'bold' }]}>Part. {item.partido}</Text>
                    </View>
                    <View style={styles.equiposContainer}>
                      <Text style={styles.equipoText}>{item.local}</Text>
                      <View style={styles.marcadorBox}>
                        <Text style={styles.golesTexto}>
                          {item.jugado ? `${item.golesLocal} - ${item.golesVisitante}` : 'VS'}
                        </Text>
                      </View>
                      <Text style={styles.equipoText}>{item.visitante}</Text>
                    </View>
                  </View>
                ))}

                {/* --- SECCIÓN 2: TABLA ÚNICA DE POSICIONES --- */}
                <Text style={[styles.tituloSeccion, { marginTop: 30 }]}>Tabla de Posiciones</Text>
                <View style={styles.tablaContainer}>
                  <View style={styles.tablaHeader}>
                    <Text style={[styles.colEquipo, { color: 'white' }]}>Equipo</Text>
                    <Text style={[styles.colDato, { color: 'white' }]}>PTS</Text>
                    <Text style={[styles.colDato, { color: 'white' }]}>PJ</Text>
                    <Text style={[styles.colDato, { color: 'white' }]}>DG</Text>
                  </View>
                  {posiciones.length === 0 ? (
                    <Text style={{padding: 20, textAlign: 'center', color: '#999'}}>Esperando resultados...</Text>
                  ) : (
                    posiciones.map((item, index) => (
                      <View key={index} style={[styles.tablaFila, index % 2 === 0 ? { backgroundColor: '#F9F9F9' } : { backgroundColor: '#FFF' }]}>
                        <Text style={styles.colEquipo}>{index + 1}. {item.equipo}</Text>
                        <Text style={[styles.colDato, { fontWeight: 'bold' }]}>{item.pts}</Text>
                        <Text style={styles.colDato}>{item.pj}</Text>
                        <Text style={styles.colDato}>{item.dg}</Text>
                      </View>
                    ))
                  )}
                </View>
                <View style={{height: 50}} /> 
              </>
            )}
          </View>
        </ScrollView>
      
      <View style={styles.footerContainer}>
        <SponsorCarousel />
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 footerContainer: {
  height: 100, 
  width: '100%',
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderColor: '#eee',
  justifyContent: 'center',
  paddingBottom: 10, 
  },
  btnPdf: { backgroundColor: '#D32F2F', padding: 15, marginBottom: 15, borderRadius: 8, alignItems: 'center' },
  btnPdfText: { color: 'white', fontWeight: 'bold' },
  selectorContainer: { flexDirection: 'row', marginBottom: 20 },
  btnSelector: { flex: 1, padding: 12, backgroundColor: '#EEE', marginHorizontal: 5, borderRadius: 25, alignItems: 'center' },
  btnActive: { backgroundColor: '#000' },
  textSelector: { fontWeight: 'bold', color: '#666' },
  textActive: { color: '#FFF' },
  tituloSeccion: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#D32F2F' },
  tarjetaPartido: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 12, elevation: 3, flexDirection: 'row', alignItems: 'center' },
  infoHora: { borderRightWidth: 1, borderRightColor: '#EEE', paddingRight: 15, alignItems: 'center', width: 85 },
  horaText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  canchaText: { fontSize: 11, color: '#999' },
  equiposContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10 },
  equipoText: { fontSize: 13, fontWeight: 'bold', width: '35%', textAlign: 'center' },
  marcadorBox: { backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, minWidth: 45, alignItems: 'center' },
  golesTexto: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F' },
  tablaContainer: { backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', elevation: 3, marginBottom: 50 },
  tablaHeader: { flexDirection: 'row', backgroundColor: '#333', padding: 10 },
  tablaFila: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  colEquipo: { flex: 3, fontSize: 14, fontWeight: '600' },
  colDato: { flex: 1, textAlign: 'center', fontSize: 14 },
  subTitulo: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 10, textAlign: 'center', backgroundColor: '#eee', padding: 5, borderRadius: 5 },
  divider: { height: 2, backgroundColor: '#D32F2F', marginVertical: 30, opacity: 0.2 },
  vsText: { fontWeight: 'bold', color: '#D32F2F', fontSize: 14 },
});

export default FixtureScreen;