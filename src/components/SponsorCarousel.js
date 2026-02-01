import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Platform, 
  useWindowDimensions 
} from 'react-native';

const SPONSORS = [
  { id: '1', image: require('../../assets/pureZone.png'), link: 'https://instagram.com/pure.zonespa' },
  { id: '2', image: require('../../assets/LabDelMilagro.png'), link: 'https://wa.me/5493875145872' },
  { id: '3', image: require('../../assets/vetaSolutions.png'), link: 'https://instagram.com/veta.solutions' },
  { id: '4', image: require('../../assets/avg.png'), link: 'https://instagram.com/grupoagv' },
  { id: '5', image: require('../../assets/MarthaF.png'), link: 'https://wa.me/5493875056536' },
  { id: '6', image: require('../../assets/panificarte.png'), link: 'https://instagram.com/panificarte.salta' },
  { id: '7', image: require('../../assets/SistemasZamba.jpg'), link: 'https://wa.me/5493875057281' },
];

export default function SponsorCarousel() {
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  const handlePress = async (url) => {
    if (!url) return;
    if (Platform.OS === 'web') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => console.log("Error al abrir URL"));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SPONSORS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (width > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [index, width]);

  return (
    <View style={[styles.container, { width: width }]}>
      <FlatList
        ref={flatListRef}
        data={SPONSORS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, idx) => ({ 
          length: width, 
          offset: width * idx, 
          index: idx 
        })}
        renderItem={({ item }) => (
          <TouchableOpacity 
           onPress={() => handlePress(item.link)} 
            style={[styles.card, { width: width }]} 
          >
           <View style={styles.imageWrapper}>
            <Image 
              source={item.image} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 100, backgroundColor: '#fff' },
  card: { 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  imageWrapper: {
    width: '85%',
    height: 60,    
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { 
    width: '100%', 
    height: '100%' 
  },
});