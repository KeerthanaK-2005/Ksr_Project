import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function SwipeHint({ index, total, filterActive }) {
  const showLeft = index > 0;
  const showRight = index < total - 1;

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

   if (filterActive) return null; 

  return (
    <Animated.View style={[styles.swipeHintContainer, { opacity: animatedOpacity }]}>
      <View style={styles.swipeContent}>
        {showLeft && <Icon name="chevron-left" size={14} color="#fff" />}
        <Text style={styles.swipeText}>Swipe for more</Text>
        {showRight && <Icon name="chevron-right" size={14} color="#fff" />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  swipeHintContainer: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  swipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swipeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: 0.4,
  },
});
