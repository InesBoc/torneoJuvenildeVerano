import React from 'react';
import { View, Text } from 'react-native';

import MapView, { Marker } from 'react-native-maps';

export default function MapaProxy({ styles }) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: -24.7471,
        longitude: -65.4953,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
    <Marker 
        coordinate={{ latitude: -24.7471, longitude: -65.4953 }} 
        title="Tigres Rugby Club"
        description="Click para indicaciones"
        onCalloutPress={() => {
            const url = `google.navigation:q=-24.747121746091644, -65.49538305044946`;
            Linking.openURL(url);
    }}
    />
    </MapView>
  );
}