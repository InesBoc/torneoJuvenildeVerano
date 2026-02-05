import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { globalStyles } from '../styles/globalStyles';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import logoClub from '../../assets/icon.png';
import { Asset } from 'expo-asset';

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
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
      await updateDoc(doc(db, "partidos", partido.id), {
        golesLocal: parseInt(gL) || 0,
        golesVisitante: parseInt(gV) || 0,
        jugado: true
      });
      Alert.alert("Guardado", "✅ Resultado actualizado");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

const generarPlanillaPartido = async (partido) => {
  try {
    const snapshot = await getDocs(collection(db, "inscripciones"));
    
    let equipoLocData = null;
    let equipoVisData = null;

    snapshot.forEach(doc => {
      const data = doc.data();

      data.equipos?.forEach(e => {
      
        const matchNombre = e.nombreFixture?.trim().toLowerCase() === partido.local.trim().toLowerCase();
        const matchNombreVis = e.nombreFixture?.trim().toLowerCase() === partido.visitante.trim().toLowerCase();
        const matchCat = e.id?.toLowerCase().includes(partido.categoria.replace(/\D/g, ""));

        if (matchNombre && matchCat) equipoLocData = e;
        if (matchNombreVis && matchCat) equipoVisData = e;
      });
    });

    const jugadorasLoc = equipoLocData?.jugadoras || [];
    const jugadorasVis = equipoVisData?.jugadoras || [];
    const staffLoc = equipoLocData?.staff || {};
    const staffVis = equipoVisData?.staff || {};

    const logoAsset = Asset.fromModule(logoClub);
    const logoUri = logoAsset.uri;
   const htmlContenido = `
      <html>
        <head>
          <style>
            @page { 
              size: A4; 
              margin: 10mm 0mm;
            } 
            body { 
              font-family: 'Arial', sans-serif; 
              padding: 5px 40px;
              margin: 0;
              color: #000;
              display: flex;
              flex-direction: column;
            }
            
            .header { 
              position: relative;
              text-align: center; 
              border: 2px solid #000; 
              padding: 10px; 
              margin-bottom: 10px; 
              min-height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
              .logo-container {
              width: 70px;
              height: 70px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .header img { 
              max-height: 70px;
              width: auto;
            }

            .header-text { flex-grow: 1; text-align: center; margin-right: 70px; } 
            .header h2 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px; }
            .info-row { 
              display: flex; 
              justify-content: space-between; 
              border: 2px solid #000; 
              padding: 10px; 
              margin-bottom: 10px; 
              background: #f0f0f0; 
              font-weight: bold; 
              font-size: 12px; 
            }

            .main-container { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .team-column { 
              width: 48.5%; 
              display: flex; 
              flex-direction: column; 
            }
            
            .title-team { 
              text-align: center; 
              font-weight: bold; 
              border: 2px solid #000; 
              background: #000; 
              color: #fff; 
              padding: 8px; 
              font-size: 14px; 
              text-transform: uppercase;
              margin-bottom: 5px;
            }

            table { 
              width: 100%; 
              border-collapse: collapse; 
              table-layout: fixed; 
            }
            th { border: 1.5px solid #000; font-size: 10px; padding: 5px; background: #eee; }
            td { 
              border: 1.5px solid #000; 
              padding: 0 4px; 
              height: 20px; 
              max-height: 20px;
              font-size: 10px; 
              white-space: nowrap; 
              overflow: hidden; 
              text-overflow: ellipsis; 
            }

            .table-wrapper { flex-grow: 1; }

            .staff-box { margin-top: 5px; border: 1px solid #000; padding: 5px; background: #fdfdfd; }
            .staff-line { border-bottom: 1px solid #ddd; padding: 5px 0; font-size: 10px; }
            
            .signature-section { margin-top: 15px; display: flex; flex-direction: column; gap: 20px; }
            .sig-item { border-top: 1.5px solid #000; text-align: center; font-size: 9px; width: 80%; margin: 0 auto; padding-top: 5px; }

            .goles-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            .goles-table thead th { 
                background: #000; 
                color: #fff; 
                font-size: 8px; 
                padding: 5px; 
                text-transform: uppercase;
                border: 1px solid #000;
            }
            .goles-table td { height: 26px; border: 1px solid #000; }

            .goles-table th:nth-child(5n), .goles-table td:nth-child(5n) { border-right: 3px solid #000; }
            .goles-table th:first-child, .goles-table td:first-child { border-left: 3px solid #000; }
            .goles-table tr:last-child td { border-bottom: 3px solid #000; }
            .goles-table thead tr th { border-top: 3px solid #000; }

            .footer-notes { margin-top: 5px; }
            .refs { font-style: italic; font-size: 11px; margin-bottom: 5px; }
            .refs b { font-style: normal; margin-right: 15px; }
            .observaciones-label { font-weight: bold; font-size: 11px; text-decoration: underline; margin-bottom: 4px; }
            .obs-line { border-bottom: 1px solid #000; height: 18px; width: 100%; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <img src="${logoUri}" alt="Escudo">
            </div>
            <div class="header-text">
              <h2>TIGRES RUGBY CLUB</h2>
              <div style="font-size: 13px; margin-top: 3px;">PLANILLA DE PARTIDO OFICIAL - <strong>${partido.categoria.toUpperCase()}</strong></div>
            </div>
          </div>

          <div class="info-row">
            <span>FECHA: ${partido.dia || '___/___'}</span>
            <span>HORA: ${partido.hora || '___:___'}</span>
            <span>CANCHA: ${partido.cancha}</span>
            <span>ZONA: ${partido.zona}</span>
            <span>PARTIDO N°: ${partido.partido}</span>
          </div>

          <div class="main-container">
            <div class="team-column">
              <div class="title-team">${partido.local}</div>
              <table>
                <thead>
                  <tr><th width="15%">N°</th><th>JUGADORA (Apellido, Nombre)</th><th width="8%">V</th><th width="8%">A</th><th width="8%">R</th></tr>
                </thead>
                <tbody>
                  ${Array.from({ length: 20 }).map((_, i) => {
                    const j = jugadorasLoc[i];
                    return `<tr>
                      <td style="text-align:center; font-weight:bold; font-size:12px;">${j?.dorsal || j?.numero || ''}</td>
                      <td>${j ? `${j.apellido.trim().toUpperCase()}, ${j.nombre.trim().toUpperCase()}` : ''}</td>
                      <td></td><td></td><td></td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
              <div class="staff-box">
                <div class="staff-line"><strong>DT:</strong> ${staffLoc.dt || ''}</div>
                <div class="staff-line"><strong>AC:</strong> ${staffLoc.ac || ''}</div>
                <div class="staff-line"><strong>PF:</strong> ${staffLoc.pf || ''}</div>
                <div class="staff-line"><strong>JEFE DE EQUIPO:</strong> ${staffLoc.jefe || ''}</div>
                <div class="signature-section">
                  <div class="sig-item">FIRMA ÁRBITRO</div>
                  <div class="sig-item">FIRMA MESA DE CONTROL</div>
                  <div class="sig-item">FIRMA CAPITÁN LOCAL</div>
                </div>
              </div>
            </div>

            <div class="team-column">
              <div class="title-team">${partido.visitante}</div>
              <table>
                <thead>
                  <tr><th width="15%">N°</th><th>JUGADORA (Apellido, Nombre)</th><th width="8%">V</th><th width="8%">A</th><th width="8%">R</th></tr>
                </thead>
                <tbody>
                  ${Array.from({ length: 20 }).map((_, i) => {
                    const j = jugadorasVis[i];
                    return `<tr>
                      <td style="text-align:center; font-weight:bold; font-size:12px;">${j?.dorsal || j?.numero || ''}</td>
                      <td>${j ? `${j.apellido.trim().toUpperCase()}, ${j.nombre.trim().toUpperCase()}` : ''}</td>
                      <td></td><td></td><td></td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
              <div class="staff-box">
                <div class="staff-line"><strong>DT:</strong> ${staffVis.dt || ''}</div>
                <div class="staff-line"><strong>AC:</strong> ${staffVis.ac || ''}</div>
                <div class="staff-line"><strong>PF:</strong> ${staffVis.pf || ''}</div>
                <div class="staff-line"><strong>JEFE DE EQUIPO:</strong> ${staffVis.jefe || ''}</div>
                <div class="signature-section">
                  <div class="sig-item">FIRMA ÁRBITRO</div>
                  <div class="sig-item">FIRMA MESA DE CONTROL</div>
                  <div class="sig-item">FIRMA CAPITÁN VISITANTE</div>
                </div>
              </div>
            </div>
          </div>

          <table class="goles-table" style="margin-top: 5px;">
            <thead>
              <tr>
                   ${Array(3).fill('<th>EQUIPO</th><th>MIN</th><th>N° JUG</th><th>ACCION</th><th>RESULT P.</th>').join('')}
              </tr>
            </thead>
            <tbody>
              ${Array(5).fill(0).map(() => `
                <tr>
                  ${Array(15).fill('<td></td>').join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer-notes">
            <div class="refs">
              <b>J</b> jugada &nbsp;&nbsp; <b>C</b> corner &nbsp;&nbsp; <b>P</b> penal
            </div>
            <div class="observaciones">OBSERVACIONES:</div>
            <div style="border-bottom: 1px solid #000; height: 20px;"></div>
          </div>
        </body>
      </html>
    `;
 
    const printOptions = {
      html: htmlContenido,
      base64: false
    };

    if (Platform.OS === 'web') {
      const win = window.open('', '_blank');
      win.document.write(htmlContenido);
      win.document.close();
      setTimeout(() => win.print(), 800);
    } else {
      const { uri } = await Print.printToFileAsync(printOptions);
      await Sharing.shareAsync(uri);
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo generar la planilla.");
  }
};
  const renderPartido = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.headerCard}>Partido N° {item.partido} - Cancha {item.cancha}</Text>
      <View style={styles.row}>
        <View style={styles.equipoCont}>
          <Text style={styles.equipoNombre}>{item.local}</Text>
          <TextInput
            style={styles.inputGoles}
            keyboardType="numeric"
            placeholder={item.golesLocal?.toString() || "0"}
            onChangeText={(val) => setEditando({ ...editando, [item.id]: { ...editando[item.id], golesLocal: val } })}
          />
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={styles.equipoCont}>
          <TextInput
            style={styles.inputGoles}
            keyboardType="numeric"
            placeholder={item.golesVisitante?.toString() || "0"}
            onChangeText={(val) => setEditando({ ...editando, [item.id]: { ...editando[item.id], golesVisitante: val } })}
          />
          <Text style={styles.equipoNombre}>{item.visitante}</Text>
        </View>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnGuardar} onPress={() => handleGuardar(item)}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>GUARDAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPdf} onPress={() => generarPlanillaPartido(item)}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>📄 PLANILLA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.mainContainer}>
      <View style={styles.selector}>
        {['Sub 14', 'Sub 16'].map(cat => (
          <TouchableOpacity key={cat} style={[styles.btnCat, categoria === cat && styles.btnCatActive]} onPress={() => setCategoria(cat)}>
            <Text style={[styles.txtCat, categoria === cat && styles.txtCatActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.selector}>
        {['A', 'B', 'Definición'].map(z => (
          <TouchableOpacity key={z} style={[styles.btnCat, zona === z && { backgroundColor: '#333' }]} onPress={() => setZona(z)}>
            <Text style={[styles.txtCat, zona === z && { color: '#fff' }]}>Zona {z}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {cargando ? (
        <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={partidos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPartido}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay partidos</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 12, borderRadius: 12, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  equipoCont: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  inputGoles: { backgroundColor: '#f0f0f0', width: 40, height: 40, textAlign: 'center', borderRadius: 8, marginHorizontal: 8, fontSize: 16, fontWeight: 'bold', borderWidth: 1, borderColor: '#ddd' },
  equipoNombre: { fontSize: 13, width: 75, textAlign: 'center', fontWeight: 'bold', color: '#333' },
  vs: { fontWeight: 'bold', fontSize: 12, color: '#999' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btnGuardar: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center' },
  btnPdf: { backgroundColor: '#333', padding: 12, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: 'center' },
  selector: { flexDirection: 'row' },
  btnCat: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#eee', borderWidth: 0.5, borderColor: '#ccc' },
  btnCatActive: { backgroundColor: '#D32F2F' },
  txtCat: { color: '#333', fontSize: 12 },
  txtCatActive: { color: '#fff', fontWeight: 'bold' },
  headerCard: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' }
});