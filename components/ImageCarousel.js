// components/ImageCarousel.js
import React, { useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;

export default function ImageCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: CARD_WIDTH * index, animated: true });
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        nestedScrollEnabled={true}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      {/* Left Arrow */}
      {activeIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrowButton, styles.leftArrow]}
          onPress={() => scrollToIndex(activeIndex - 1)}
        >
          <Icon name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Right Arrow */}
      {activeIndex < images.length - 1 && (
        <TouchableOpacity
          style={[styles.arrowButton, styles.rightArrow]}
          onPress={() => scrollToIndex(activeIndex + 1)}
        >
          <Icon name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselWrapper: {
    position: 'relative',
    height: 280,
    backgroundColor: '#f2f2f2',
  },
  image: {
    width: CARD_WIDTH,
    height: 280,
    resizeMode: 'contain',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF6B6B',
    width: 10,
    height: 6,
    borderRadius: 3,
  },
 arrowButton: {
  position: 'absolute',
  top: '45%',
  backgroundColor: 'rgba(255, 107, 107, 0.6)', // Coral Red with reduced opacity
  padding: 6,
  borderRadius: 20,
  zIndex: 2,
},
leftArrow: {
  left: 12,
},
rightArrow: {
  right: 12,
},
});