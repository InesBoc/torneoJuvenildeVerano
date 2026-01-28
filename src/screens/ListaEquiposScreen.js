import React, { useEffect, useState } from 'react';
import { View, 
        Text, 
        StyleSheet, 
        FlatList, 
        TouchableOpacity, 
        Alert } from 'react-native';
import { useInscripcion } from '../context/InscripcionContext';
import { globalStyles } from '../styles/globalStyles'; 

const ListaEquiposScreen = ({ navigation }) => {
  const { datosInscripcion } = useInscripcion();
  const [equiposGenerados, setEquiposGenerados] = useState([]);

  const hayInscripcionActiva = datosInscripcion.club.nombre !== '';

useEffect(() => {
  if (!hayInscripcionActiva) return;

  const { nombre, cantSub14, cantSub16 } = datosInscripcion.club;
  const iniciales = [];

  const generar = (cantidad, categoria) => {
    for (let i = 0; i < cantidad; i++) {
      const letra = cantidad > 1 ? ` ${String.fromCharCode(65 + i)}` : '';
      const idGenerado = `${categoria.replace(/\s+/g, "")}-${i}`;

      const equipoExistente = datosInscripcion.equipos?.find(e => e.id === idGenerado);

      if (equipoExistente) {
        iniciales.push({
          ...equipoExistente,
          id: idGenerado,
          completado: equipoExistente.jugadoras.length >= 7,
          cantJugadores: equipoExistente.jugadoras.length
        });
      } else {
        iniciales.push({
          id: idGenerado,
          nombre: `${nombre} - ${categoria}${letra}`,
          categoria: categoria,
          completado: false,
          cantJugadores: 0
        });
      }
    }
  };

  generar(cantSub14, 'Sub 14');
  generar(cantSub16, 'Sub 16');
  setEquiposGenerados(iniciales);
}, [datosInscripcion.equipos, hayInscripcionActiva]);

  const renderEquipo = ({ item }) => {

    let colorBadge = '#000'; 
    let textoBadge = 'CARGAR';

    if (item.completado) {
      colorBadge = '#2e7d32'; 
      textoBadge = 'LISTO';
    } else if (item.cantJugadores > 0) {
      colorBadge = '#f39c12'; 
      textoBadge = 'PENDIENTE';
    }

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('FormularioBuenaFe', { 
          equipoId: item.id, 
          nombreEquipo: item.nombre
        })}
      >
        <View>
          <Text style={styles.equipoNombre}>{item.nombre}</Text>
          <Text style={styles.equipoCategoria}>
            {item.cantJugadores > 0 ? `${item.cantJugadores} jugadoras cargadas` : item.categoria}
          </Text>
        </View>
        
        <View style={[styles.badgeBase, { backgroundColor: colorBadge }]}>
          <Text style={styles.badgeText}>{textoBadge}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const todosListos = equiposGenerados.length > 0 && equiposGenerados.every(e => e.completado);

  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.scrollContent}>
        <Text style={globalStyles.title}>
          {hayInscripcionActiva ? "Equipos a Inscribir" : "Mis Equipos"}
        </Text>

        {hayInscripcionActiva ? (
          <>
            <Text style={globalStyles.subtitle}>Completa la lista de cada equipo (mín. 7 jugadoras)</Text>
            <FlatList
              data={equiposGenerados}
              renderItem={renderEquipo}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              scrollEnabled={false} 
            />
            
            <TouchableOpacity 
              style={[
                globalStyles.input, 
                { backgroundColor: todosListos ? '#D32F2F' : '#ccc', alignItems: 'center', marginTop: 10 }
              ]} 
              onPress={() => {
                if (todosListos) {
                  navigation.navigate('ResumenInscripcion');
                } else {
                  Alert.alert("Inscripción Incompleta", "Debes tener al menos 7 jugadoras en cada equipo para continuar al pago.");
                }
              }}
              disabled={!todosListos}
            >
              <Text style={globalStyles.btnText}>
                {todosListos ? "Continuar al Pago" : "Faltan listas por completar"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>No hay inscripciones en curso.</Text>
            <TouchableOpacity 
              style={[globalStyles.input, { backgroundColor: '#3498db', marginTop: 20 }]}
              onPress={() => navigation.navigate('DatosClub')}
            >
              <Text style={globalStyles.btnText}>Iniciar Nueva Inscripción</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: { fontSize: 14, color: '#666', marginBottom: 25, textAlign: 'center' },
  card: {  flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderRadius: 12,  marginBottom: 15,  elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  equipoNombre: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  equipoCategoria: { fontSize: 14, color: '#666', fontWeight: '500' },
  badgeBase: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, minWidth: 80, alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
});

export default ListaEquiposScreen;