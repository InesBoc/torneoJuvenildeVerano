import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { generarPdfBuenaFe } from '../services/PdfService';

const BotonExportarPDF = ({ datosClub, equipo }) => {
  return (
    <TouchableOpacity 
      style={styles.btn} 
      onPress={() => generarPdfBuenaFe(datosClub, equipo)}
    >
      <Text style={styles.text}>📄 DESCARGAR LISTA - {equipo.nombre}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, marginVertical: 5, alignItems: 'center' },
  text: { color: '#FFF', fontWeight: 'bold' }
});

export default BotonExportarPDF;