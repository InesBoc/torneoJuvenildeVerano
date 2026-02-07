import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  useWindowDimensions
} from 'react-native';
import { globalStyles } from '../styles/globalStyles'; 
import MapaProxy from '../components/MapaProxy'; 
import SponsorCarousel from '../components/SponsorCarousel';

export default function HomeScreen({ navigation }) {
  const { height, width } = useWindowDimensions();
  const scrollHeight = height - 100;

  return (
  <View style={{ height: height, width: width, backgroundColor: '#fff' }}>
    {/* Área de Scroll fija */}
    <View style={{ height: scrollHeight }}>
      <ScrollView 
        contentContainerStyle={[globalStyles.scrollContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={true}
      >
        <View style={globalStyles.scrollContent}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={globalStyles.title}>Torneo Juvenil de Verano 2026</Text>
            <Text style={[globalStyles.title, { fontSize: 20, marginVertical: 10 }]}>14 y 15 de Febrero</Text>
            <Text style={globalStyles.subtitle}>
              ¡Bienvenidos al 1° Torneo Juvenil de Verano de Tigres Rugby Club!
              Este Torneo fue creado para hacer un cierre de Pretemporada...
            </Text>
          </View>

          <View style={{ marginBottom: 25 }}>
            <Text style={[globalStyles.title, { fontSize: 18, textAlign: 'center', marginVertical: 10 }]}>
              Ubicación del Club
            </Text>
            <MapaProxy styles={styles} />
          </View>

          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity 
              style={[globalStyles.input, { backgroundColor: '#f34343', alignItems: 'center' }]} 
              onPress={() => navigation.navigate('DatosClub')}
            >
              <Text style={globalStyles.btnText}>Nueva Inscripción</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[globalStyles.input, { backgroundColor: '#f98975', alignItems: 'center' }]} 
              onPress={() => navigation.navigate('MisInscripciones')}
            >
              <Text style={globalStyles.btnText}>Ver Mis Inscripciones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[globalStyles.input, { backgroundColor: '#f7a684', alignItems: 'center' }]}
              onPress={() => navigation.navigate('Fixture')}
            >
              <Text style={globalStyles.btnText}>🏆 FIXTURE Y POSICIONES</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[globalStyles.input, { backgroundColor: '#a69a95', alignItems: 'center' }]} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={globalStyles.btnText}>Acceso Organizadores</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>

    <View style={styles.footer}>
      <SponsorCarousel />
    </View> 
  </View>
);
}

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: '#fff',
    overflow: 'hidden', 
  },
  scrollArea: {
    flex: 1,
  },
footer: {
    height: 100, // Alto fijo para el carrusel
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    // Esto asegura que en dispositivos con "notch" abajo no se tape
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, 
  },
  map: { height: 200, width: '100%', borderRadius: 10, marginVertical: 10 },
});