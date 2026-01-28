import React from 'react';
import { View, 
          Text, 
          ScrollView, 
          StyleSheet, 
          TouchableOpacity, 
  Linking } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function DetalleInscripcionScreen({ route, navigation }) {
  const { inscripcion } = route.params;

  return (
    <ScrollView style={globalStyles.mainContainer}>
      <View style={globalStyles.scrollContent}>
        <Text style={styles.clubTitle}>{inscripcion.club.nombre.toUpperCase()}</Text>
        <Text style={styles.ciudadSub}>{inscripcion.club.ciudad}</Text>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Estado: {inscripcion.estado}</Text>
        </View>

        {inscripcion.equipos.map((equipo, index) => (
          <View key={index} style={styles.equipoCard}>
            <Text style={styles.equipoNombre}>{equipo.nombre}</Text>
            
            <Text style={styles.sectionLabel}>Jugadoras ({equipo.jugadoras.length})</Text>
            {equipo.jugadoras.map((j, idx) => (
              <View key={idx} style={styles.jugadoraRow}>
                <Text style={styles.jugadoraInfo}>
                  {idx + 1}. {j.apellido.toUpperCase()}, {j.nombre}
                </Text>
                <Text style={styles.dniText}>DNI: {j.dni}</Text>
              </View>
            ))}

            <Text style={[styles.sectionLabel, { marginTop: 15 }]}>Cuerpo Técnico</Text>
            <View style={styles.staffBox}>
              <Text style={styles.staffText}><Text style={{fontWeight:'bold'}}>DT:</Text> {equipo.staff.dt || 'No asignado'}</Text>
              <Text style={styles.staffText}><Text style={{fontWeight:'bold'}}>AC:</Text> {equipo.staff.ac || 'No asignado'}</Text>
              <Text style={styles.staffText}><Text style={{fontWeight:'bold'}}>PF:</Text> {equipo.staff.pf || 'No asignado'}</Text>
              <Text style={styles.staffText}><Text style={{fontWeight:'bold'}}>JE:</Text> {equipo.staff.jefe || 'No asignado'}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.btnPago} 
          onPress={() => Linking.openURL(inscripcion.comprobanteUrl)}
        >
          <Text style={styles.btnPagoText}>Ver Comprobante de Pago 📄</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  clubTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  ciudadSub: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 10 },
  statusBadge: { alignSelf: 'center', backgroundColor: '#f1c40f', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
  statusText: { fontWeight: 'bold', fontSize: 12 },
  equipoCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 20, elevation: 3, borderTopWidth: 4, borderTopColor: '#D32F2F' },
  equipoNombre: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#D32F2F' },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 5, marginBottom: 10 },
  jugadoraRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  jugadoraInfo: { fontSize: 14, color: '#444' },
  dniText: { fontSize: 12, color: '#888' },
  staffBox: { backgroundColor: '#F9F9F9', padding: 10, borderRadius: 8 },
  staffText: { fontSize: 13, marginBottom: 3 },
  btnPago: { marginTop: 20, padding: 15, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#3498db', borderRadius: 10 },
  btnPagoText: { color: '#3498db', fontWeight: 'bold' }
});