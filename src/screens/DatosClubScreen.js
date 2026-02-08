import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useInscripcion } from '../context/InscripcionContext';
import { globalStyles } from '../styles/globalStyles';

const DatosClubScreen = ({ navigation }) => {
  const { datosInscripcion, actualizarClub, limpiarRegistro } = useInscripcion();

  const [nombre, setNombre] = useState(datosInscripcion.club.nombre || '');
  const [ciudad, setCiudad] = useState(datosInscripcion.club.ciudad || '');
  const [cantSub14, setCantSub14] = useState(datosInscripcion.club.cantSub14 || 0);
  const [cantSub16, setCantSub16] = useState(datosInscripcion.club.cantSub16 || 0);

  useEffect(() => {
    if (datosInscripcion.club.nombre !== '') {
      Alert.alert(
        "Inscripción en curso",
        `Tienes un borrador de "${datosInscripcion.club.nombre}". ¿Deseas continuar o empezar de cero?`,
        [
          { 
            text: "Empezar de cero", 
            onPress: async () => {
              await limpiarRegistro();
              
              setNombre('');
              setCiudad('');
              setCantSub14(0);
              setCantSub16(0);
              
              Alert.alert("Éxito", "Los datos se han borrado correctamente.");
            }, 
            style: "destructive" 
          },
          { 
            text: "Continuar", 
            onPress: () => navigation.navigate('ListaEquipos') 
          }
        ],
        { cancelable: false }
      );
    }
  }, []);

  useEffect(() => {
    setNombre(datosInscripcion.club.nombre || '');
    setCiudad(datosInscripcion.club.ciudad || '');
    setCantSub14(datosInscripcion.club.cantSub14 || 0);
    setCantSub16(datosInscripcion.club.cantSub16 || 0);
  }, [datosInscripcion.club]);

  const continuar = () => {
    const s14 = parseInt(cantSub14) || 0;
    const s16 = parseInt(cantSub16) || 0;

    if (!nombre.trim() || !ciudad.trim() || (s14 === 0 && s16 === 0)) {
      Alert.alert("Error", "Por favor completa el nombre, ciudad y selecciona al menos un equipo.");
      return;
    }

    actualizarClub({ 
      nombre: nombre.trim(), 
      ciudad: ciudad.trim(), 
      cantSub14: s14, 
      cantSub16: s16 
    });
    
    navigation.navigate('ListaEquipos');
  };

  return (
    <View style={globalStyles.mainContainer}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.scrollContent}>
        <Text style={styles.title}>Inscripción de Equipos</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Nombre del Club / Institución</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Tigres Rugby Club" 
            value={nombre}
            onChangeText={setNombre}
            autoComplete="off"
            importantForAutofill="no"
          />

          <Text style={styles.label}>Ciudad</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: Salta" 
            value={ciudad}
            onChangeText={setCiudad}
            autoComplete="off"
            importantForAutofill="no"
          />

          <Text style={styles.sectionTitle}>Cantidad de Equipos</Text>
          
          <View style={styles.counterRow}>
            <Text style={styles.label}>Sub 14 Damas:</Text>
            <TextInput 
              style={styles.inputSmall} 
              keyboardType="numeric" 
              placeholder="0"
              value={cantSub14.toString()} 
              onChangeText={(val) => {
                const numeric = val.replace(/[^0-9]/g, '');
                setCantSub14(numeric === '' ? 0 : numeric);
              }}
            />
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.label}>Sub 16 Damas:</Text>
            <TextInput 
              style={styles.inputSmall} 
              keyboardType="numeric" 
              placeholder="0"
              value={cantSub16.toString()}
              onChangeText={(val) => {
                const numeric = val.replace(/[^0-9]/g, '');
                setCantSub16(numeric === '' ? 0 : numeric);
              }}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={continuar}>
            <Text style={styles.buttonText}>Continuar a Listas de Buena Fe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#D32F2F', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color:'#D32F2F' },
  form: { marginTop: 10 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  inputSmall: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, width: 60, textAlign: 'center' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  button: { backgroundColor: 'black', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default DatosClubScreen;