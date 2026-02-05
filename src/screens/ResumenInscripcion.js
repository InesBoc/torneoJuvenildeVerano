import React, { useState } from 'react';
import { View, 
        Text, 
        TouchableOpacity, 
        ScrollView, 
        Alert, 
        Platform, 
        ActivityIndicator, 
        StyleSheet} from 'react-native';

import { db, auth, storage } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { useInscripcion } from '../context/InscripcionContext';
import { globalStyles } from '../styles/globalStyles';


const ResumenInscripcion = ({ navigation }) => {
  const { datosInscripcion, limpiarRegistro } = useInscripcion();
  const [imagenCargada, setImagenCargada] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const seleccionarImagen = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.6,
    });
    if (!resultado.canceled) {
      setImagenCargada(resultado.assets[0].uri);
    }
  };

  const generarPDF = async () => {
    if (!datosInscripcion || !datosInscripcion.club) {
        mostrarAlerta("Error", "No hay datos de inscripción para generar el PDF");
        return;
    }

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { padding: 40px; font-family: 'Helvetica'; color: #333; }
            .header { text-align: center; }
            .club-name { color: #D32F2F; margin-bottom: 5px; }
            .team-card { margin-top: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 10px; page-break-inside: avoid; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f2f2f2; text-align: left; padding: 10px; border-bottom: 2px solid #D32F2F; }
            th.num-col { width: 40px; }
            td { padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; }
            .staff-section { margin-top: 15px; background-color: #f9f9f9; padding: 10px; border-radius: 5px; }
            .staff-title { font-weight: bold; font-size: 14px; color: #D32F2F; margin-bottom: 5px; border-bottom: 1px solid #ccc; }
            .staff-grid { display: flex; flex-wrap: wrap; }
            .staff-item { width: 50%; font-size: 13px; margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="club-name">Lista de Buena Fe</h1>
            <h2 style="margin: 0;">${datosInscripcion.club.nombre.toUpperCase()}</h2>
            <p>Sede: ${datosInscripcion.club.ciudad}</p>
          </div>
          <hr />
          ${datosInscripcion.equipos.map(eq => `
            <div class="team-card">
              <h3 style="color: #D32F2F; margin-top: 0;">Equipo: ${eq.nombre}</h3>
              <table>
                <thead>
                  <tr>
                    <th class="num-col">N°</th>
                    <th>Jugadora</th>
                    <th>DNI</th>
                    <th>F. Nac.</th>
                  </tr>
                </thead>
                <tbody>
                  ${eq.jugadoras.map(j => `
                    <tr>
                      <td style="font-weight: bold; color: #D32F2F;">${j.dorsal || '-'}</td>
                      <td>${j.apellido.toUpperCase()}, ${j.nombre}</td>
                      <td>${j.dni}</td>
                      <td>${j.fechaNac}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="staff-section">
                <div class="staff-title">CUERPO TÉCNICO</div>
                <div class="staff-grid">
                  <div class="staff-item"><strong>DT:</strong> ${eq.staff?.dt || '---'}</div>
                  <div class="staff-item"><strong>AC:</strong> ${eq.staff?.ac || '---'}</div>
                  <div class="staff-item"><strong>PF:</strong> ${eq.staff?.pf || '---'}</div>
                  <div class="staff-item"><strong>Jefe:</strong> ${eq.staff?.jefe || '---'}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    if (Platform.OS === 'web') {
      const win = window.open('', '_blank');
      win.document.write(htmlContent);
      win.document.close();
      setTimeout(() => win.print(), 500);
    } else {
      try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri);
      } catch (error) {
        mostrarAlerta("Error", "No se pudo generar el PDF");
      }
    }
  };

  const confirmarInscripcion = async () => {
    if (datosInscripcion.equipos.length === 0) {
      mostrarAlerta("Error", "Debes agregar al menos un equipo");
      return;
    }
    if (!imagenCargada) {
      mostrarAlerta("Atención", "Sube el comprobante primero");
      return;
    }

    setEnviando(true);
    
    try {
      const user = auth.currentUser;
      const uidFinal = user ? user.uid : "anonimo";
      let urlPublica = "no_image_url";

     
      try {
        const response = await fetch(imagenCargada);
        const blob = await response.blob();
        const storageRef = ref(storage, `comprobantes/${uidFinal}_${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        urlPublica = await getDownloadURL(storageRef);
      } catch (e) { 
        console.error("Error Storage:", e); 
      }

      const payload = {
        usuarioId: uidFinal,
        club: {
          nombre: datosInscripcion.club.nombre || "Sin nombre",
          ciudad: datosInscripcion.club.ciudad || "Sin ciudad",
        },
        equipos: datosInscripcion.equipos.map(eq => ({
          id: String(eq.id),
          nombre: String(eq.nombre),
          jugadoras: eq.jugadoras,
          staff: eq.staff || {}
        })),
        comprobanteUrl: urlPublica,
        fechaInscripcion: serverTimestamp(),
        estado: 'Pendiente'
      };

      await addDoc(collection(db, "inscripciones"), payload);

      setEnviando(false);

      
      if (Platform.OS === 'web') {
        window.alert("¡Éxito! Tu inscripción ha sido enviada.");
        limpiarRegistro();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }], 
        });
      } else {
        Alert.alert("¡Éxito!", "Inscripción enviada correctamente", [
          { 
            text: "OK", 
            onPress: () => {
              limpiarRegistro();
              navigation.navigate('Home'); 
            } 
          }
        ]);
      }
    } catch (error) {
      console.error("Error al confirmar:", error);
      setEnviando(false);
      mostrarAlerta("Error", "Hubo un problema al guardar los datos");
    }
  }; 

  return (
    <ScrollView style={globalStyles.mainContainer}>
      <View style={globalStyles.scrollContent}>
        <Text style={globalStyles.title}>Resumen y Envío</Text>

        <View style={styles.resumenCard}>
          <Text style={styles.resumenClub}>{datosInscripcion.club?.nombre || 'Club no definido'}</Text>
          <Text style={styles.resumenCiudad}>{datosInscripcion.club?.ciudad || 'Ciudad no definida'}</Text>
          <View style={styles.divider} />
          <Text style={styles.labelEquipos}>Equipos a inscribir:</Text>
          {datosInscripcion.equipos?.map((eq, i) => (
            <Text key={i} style={styles.equipoItem}>✅ {eq.nombre} ({eq.jugadoras?.length || 0} jugadoras)</Text>
          ))}
        </View>

        <TouchableOpacity style={styles.btnDescarga} onPress={generarPDF}>
          <Text style={styles.btnDescargaText}>📥 DESCARGAR LISTA EN PDF</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity 
          style={[styles.btnUpload, imagenCargada && {borderColor: '#2e7d32', backgroundColor: '#e8f5e9'}]} 
          onPress={seleccionarImagen}
        >
          <Text style={{color: imagenCargada ? '#2e7d32' : '#666', fontWeight: 'bold', textAlign: 'center'}}>
            {imagenCargada ? "✅ COMPROBANTE CARGADO" : "📸 SUBIR FOTO DEL COMPROBANTE"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[globalStyles.input, { backgroundColor: '#D32F2F', marginTop: 30, alignItems: 'center', justifyContent: 'center' }]} 
          onPress={confirmarInscripcion}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={globalStyles.btnText}>ENVIAR TODO Y FINALIZAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  resumenCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, marginBottom: 20 },
  resumenClub: { fontSize: 22, fontWeight: 'bold', color: '#D32F2F' },
  resumenCiudad: { fontSize: 16, color: '#666' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  labelEquipos: { fontWeight: 'bold', fontSize: 14, marginBottom: 8, color: '#333' },
  equipoItem: { fontSize: 15, marginBottom: 5, color: '#444' },
  btnDescarga: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#D32F2F', alignItems: 'center', marginBottom: 10 },
  btnDescargaText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 13 },
  btnUpload: { padding: 25, borderWidth: 2, borderStyle: 'dashed', borderColor: '#ccc', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }
});

export default ResumenInscripcion;