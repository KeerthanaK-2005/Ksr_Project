import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const SNOWFLAKE_COUNT = 24;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

const Snowfall = () => {
  const snowflakes = useRef(
    Array.from({ length: SNOWFLAKE_COUNT }).map(() => ({
      x: new Animated.Value(randomBetween(0, width)),
      y: new Animated.Value(randomBetween(-height, 0)),
      size: randomBetween(6, 16),
      duration: randomBetween(4000, 9000),
      delay: randomBetween(0, 4000),
    }))
  ).current;

  useEffect(() => {
    snowflakes.forEach((flake) => {
      const animate = () => {
        flake.x.setValue(randomBetween(0, width));
        flake.y.setValue(-flake.size);
        Animated.timing(flake.y, {
          toValue: height + flake.size,
          duration: flake.duration,
          delay: flake.delay,
          useNativeDriver: true,
        }).start(() => animate());
      };
      animate();
    });
    // No cleanup needed; snowflakes loop forever
  }, [snowflakes]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {snowflakes.map((flake, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.snowflake,
            {
              width: flake.size,
              height: flake.size,
              borderRadius: flake.size / 2,
              opacity: 0.7,
              backgroundColor: '#b3d4fc',
              transform: [
                { translateX: flake.x },
                { translateY: flake.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  snowflake: {
    position: 'absolute',
    zIndex: 0,
  },
});

export default Snowfall; 