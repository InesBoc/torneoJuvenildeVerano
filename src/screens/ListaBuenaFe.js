import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform } from 'react-native';
import { useInscripcion } from '../context/InscripcionContext';
import { globalStyles } from '../styles/globalStyles';

const ListaBuenaFe = ({ route, navigation }) => {

  const { nombreEquipo, equipoId } = route.params;
  const { guardarEquipo, datosInscripcion } = useInscripcion();
  const equipoExistente = datosInscripcion.equipos.find(e => e.id === equipoId);
  const [nuevaJugadora, setNuevaJugadora] = useState({ apellido: '', nombre: '', dni: '', fechaNac: '' });
  const [jugadoras, setJugadoras] = useState(equipoExistente?.jugadoras || []);
  const [staff, setStaff] = useState(equipoExistente?.staff || { dt: '', ac: '', pf: '', jefe: '' });
  
  const inputDT = useRef(null);
  const inputAC = useRef(null);
  const inputPF = useRef(null);
  const inputJE = useRef(null);

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const formatearFecha = (texto) => {
    let limpio = texto.replace(/\D/g, "");
    if (limpio.length > 2 && limpio.length <= 4) return `${limpio.slice(0, 2)}/${limpio.slice(2)}`;
    if (limpio.length > 4) return `${limpio.slice(0, 2)}/${limpio.slice(2, 4)}/${limpio.slice(4, 8)}`;
    return limpio;
  };

  const agregarALista = () => {
    const { nombre, apellido, dni, fechaNac } = nuevaJugadora;
    const categoriaAuto = nombreEquipo.includes("14") ? "Sub 14" : "Sub 16";

    if (!nombre || !apellido || !dni || fechaNac.length < 10) {
      mostrarAlerta("Atención", "Completa todos los datos de la jugadora.");
      return;
    }

    if (dni.length < 7 || dni.length > 8) {
      mostrarAlerta("Error", "El DNI debe tener 7 u 8 dígitos.");
      return;
    }

    const partes = fechaNac.split('/');
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const anio = parseInt(partes[2]);

    if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      mostrarAlerta("Error", "Fecha inválida.");
      return;
    }

    if (categoriaAuto === "Sub 14") {
    if (anio < 2012 || anio > 2014) {
      mostrarAlerta("Categoría Sub 14", "Para Sub 14, deben ser nacidas entre 2012 y 2014.");
      return;
    }
  } else {
   
    if (anio < 2010 || anio > 2013) {
      mostrarAlerta("Categoría Sub 16", "Para Sub 16, deben ser nacidas entre 2010 y 2013.");
      return;
    }
  }

    if (jugadoras.find(j => j.dni === dni)) {
      mostrarAlerta("Duplicado", "Este DNI ya está en la lista.");
      return;
    }

    setJugadoras([...jugadoras, { ...nuevaJugadora, id: Date.now().toString() }]);
    setNuevaJugadora({ apellido: '', nombre: '', dni: '', fechaNac: '' });

    if (jugadoras.length >= 19) { 
      inputDT.current?.focus(); 
    }
  };

  const finalizarCarga = () => {
    const esValido = jugadoras.length >= 7 && jugadoras.length <= 20;
    
    guardarEquipo({ 
      id: equipoId, 
      nombre: nombreEquipo, 
      jugadoras, 
      staff, 
      completado: esValido 
    });

    if (esValido) {
      mostrarAlerta("Éxito", "Lista de buena fe guardada correctamente.");
      navigation.goBack(); 
    } else {
      mostrarAlerta("Progreso Guardado", `Se guardaron ${jugadoras.length} jugadoras. Mínimo requerido: 7.`);
      navigation.goBack();
    }
  };
  return (
    <View style={globalStyles.mainContainer}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.header}>{nombreEquipo}</Text>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>1. Datos de la Jugadora</Text>
          <TextInput 
            style={globalStyles.input} 
            placeholder="Apellido" 
            value={nuevaJugadora.apellido} 
            onChangeText={(v) => setNuevaJugadora({...nuevaJugadora, apellido: v})}
          />
          <TextInput 
            style={globalStyles.input} 
            placeholder="Nombre" 
            value={nuevaJugadora.nombre} 
            onChangeText={(v) => setNuevaJugadora({...nuevaJugadora, nombre: v})}
          />
          <View style={styles.row}>
            <TextInput 
              style={[globalStyles.input, { width: '48%' }]} 
              placeholder="DNI" 
              keyboardType="numeric" 
              maxLength={8} 
              value={nuevaJugadora.dni} 
              onChangeText={(v) => setNuevaJugadora({...nuevaJugadora, dni: v.replace(/\D/g, "")})}
            />
            <TextInput 
              style={[globalStyles.input, { width: '48%' }]} 
              placeholder="DD/MM/AAAA" 
              keyboardType="numeric" 
              maxLength={10} 
              value={nuevaJugadora.fechaNac} 
              onChangeText={(v) => setNuevaJugadora({...nuevaJugadora, fechaNac: formatearFecha(v)})} 
            />
          </View>
          <TouchableOpacity style={styles.btnCargar} onPress={agregarALista}>
            <Text style={globalStyles.btnText}>+ AÑADIR A LA LISTA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>2. Jugadoras ({jugadoras.length}) - Mínimo 7</Text>
          {jugadoras.map((item, index) => (
            <View key={item.id} style={styles.itemJugadora}>
              <Text style={styles.indexNumber}>{index + 1}.</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTextBold}>{item.apellido.toUpperCase()}, {item.nombre}</Text>
                <Text style={styles.itemSubtext}>DNI: {item.dni} | {item.fechaNac}</Text>
              </View>
              <TouchableOpacity onPress={() => setJugadoras(jugadoras.filter(j => j.id !== item.id))}>
                <Text style={styles.btnQuitar}>Quitar</Text>
              </TouchableOpacity>
            </View>
          ))}
          {jugadoras.length === 0 && <Text style={styles.emptyText}>No hay jugadoras en la lista</Text>}
        </View>

        <View style={styles.staffCard}>
          <Text style={styles.sectionTitle}>3. Cuerpo Técnico</Text>
          <TextInput 
            ref={inputDT} 
            style={globalStyles.input} 
            placeholder="Director Técnico" 
            value={staff.dt} 
            onChangeText={(v) => setStaff({...staff, dt: v})} 
          />
          <TextInput 
            ref={inputAC} 
            style={globalStyles.input} 
            placeholder="Ayudante de Campo" 
            value={staff.ac} 
            onChangeText={(v) => setStaff({...staff, ac: v})} 
          />
          <TextInput 
            ref={inputPF} 
            style={globalStyles.input} 
            placeholder="Preparador Físico"
            value={staff.pf} 
            onChangeText={(v) => setStaff({...staff, pf: v})} 
          />
          <TextInput 
            ref={inputJE} 
            style={globalStyles.input} 
            placeholder="Jefe de Equipo" 
            value={staff.jefe} 
            onChangeText={(v) => setStaff({...staff, jefe: v})} 
          />
        </View>

        <TouchableOpacity 
          style={[
            globalStyles.btnFinalizar, 
            { backgroundColor: jugadoras.length >= 7 ? '#D32F2F' : '#666', marginTop: 30 }
          ]} 
          onPress={finalizarCarga}
        >
          <Text style={globalStyles.btnFinalizar}>FINALIZAR CARGA DE EQUIPO</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#D32F2F' },
  formCard: { backgroundColor: '#F2F2F2', padding: 15, borderRadius: 10, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#000' },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btnCargar: { backgroundColor: '#000', padding: 15, borderRadius: 5, alignItems: 'center' },
  listSection: { marginVertical: 10 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  itemJugadora: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center', backgroundColor: '#FFF' },
  indexNumber: { fontWeight: 'bold', marginRight: 10 },
  itemTextBold: { fontWeight: 'bold', fontSize: 14 },
  itemSubtext: { fontSize: 12, color: '#666' },
  btnQuitar: { color: 'red', fontSize: 12 },
  emptyText: { textAlign: 'center', color: '#AAA', fontStyle: 'italic', marginVertical: 20 },
  staffCard: { marginTop: 20, padding: 15, backgroundColor: '#F9F9F9', borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});

export default ListaBuenaFe;