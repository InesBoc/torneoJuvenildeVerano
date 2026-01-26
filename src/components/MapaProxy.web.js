import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';

export default function MapaProxy({ styles }) {
  const lat = -24.748869;
  const lon = -65.493939;
  
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

  const abrirMapa = () => {
    Linking.openURL(googleMapsUrl).catch(err => 
      console.error("No se pudo abrir el mapa", err)
    );
  };

  return (
    <View style={styles.mapContainer}>
      <View style={[styles.map, { 
        backgroundColor: '#f9f9f9', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 20
      }]}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#D32F2F', marginBottom: 5 }}>
          📍 Sede Tigres Rugby Club
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
          San Lorenzo, Salta
        </Text>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#34a853', 
            paddingVertical: 12, 
            paddingHorizontal: 25, 
            borderRadius: 25,
            elevation: 3, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3
          }}
          onPress={abrirMapa}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            VER INDICACIONES
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}