import React from 'react';
import { View, Text } from 'react-native';

import MapView, { Marker } from 'react-native-maps';

export default function MapaProxy({ styles }) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude:-24.748896, 
        longitude: -65.493877,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
    <Marker 
        coordinate={{ latitude: -24.748896, longitude: -65.493877 }} 
        title="Tigres Rugby Club"
        description="Click para indicaciones"
        onCalloutPress={() => {
            const url = `google.navigation:q=-24.748896, -65.493877`;
            Linking.openURL(url);
    }}
    />
    </MapView>
  );
}