import React, { useEffect, useRef, useState } from 'react';
import { View, 
        Image, 
        FlatList, 
        Dimensions, 
        StyleSheet,
        TouchableOpacity, 
        Linking, 
        Platform } from 'react-native';

const { width } = Dimensions.get('window');

const SPONSORS = [
  { id: '1', 
    image: require('../../assets/pureZone.png'),
    link: 'https://instagram.com/pure.zonespa' },
  { id: '2', 
    image: require('../../assets/LabDelMilagro.png'),
    link: 'https://wa.me/5493875145872'
     },
  { id: '3', 
    image: require('../../assets/vetaSolutions.png'),
    link: 'https://instagram.com/veta.solutions' },
  { id: '4', 
    image: require('../../assets/avg.png'),
    link: 'https://instagram.com/grupoagv' },
];

export default function SponsorCarousel() {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  const getItemLayout = (data, index) => ({
  length: width,
  offset: width * index,
  index,
});

  const handlePress = (url) => {
  if (!url) return;

  if (Platform.OS === 'web') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    Linking.openURL(url).catch(err => console.error("Error", err));
  }
};

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % SPONSORS.length);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, [index]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SPONSORS}
        horizontal
        pagingEnabled
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={() => handlePress(item.link)} 
        style={styles.card}
      >
        <Image source={item.image} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>
    )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 100, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderColor: '#eee', 
    marginBottom: 50,
    zIndex: 999, 
    elevation: 5 },
  card: { width: width, justifyContent: 'center', alignItems: 'center' },
  logo: { width: width * 0.7, height: 80 },
});