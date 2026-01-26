import React from 'react';
import { View, Text } from 'react-native';

import MapView, { Marker } from 'react-native-maps';

export default function MapaProxy({ styles }) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude:-24.748869, 
        longitude: -65.493939,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
    <Marker 
        coordinate={{ latitude: -24.748869, longitude: -65.493939 }} 
        title="Tigres Rugby Club"
        description="Click para indicaciones"
        onCalloutPress={() => {
            const url = `google.navigation:q=-24.748869, -65.493939`;
            Linking.openURL(url);
    }}
    />
    </MapView>
  );
}