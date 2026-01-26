import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function MapaProxy({ styles }) {
  const lat = -24.7471;
  const lon = -65.4953;
  // URL para abrir Google Maps con la ubicación y pedir indicaciones
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  return (
    <View style={styles.mapContainer}>
      <View style={[styles.map, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc' }]}>
        <Text style={{ fontWeight: 'bold', color: '#D32F2F', marginBottom: 5 }}>📍 Sede Tigres Rugby Club</Text>
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 15 }}>San Lorenzo, Salta</Text>
        
        <TouchableOpacity 
          style={{ backgroundColor: '#3498db', padding: 10, borderRadius: 8 }}
          onPress={() => Linking.openURL(googleMapsUrl)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>¿CÓMO LLEGAR?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}