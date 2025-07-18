import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LottieLogoutButton = ({ onPress }) => {
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePress = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const handleAnimationFinish = async () => {
    setIsAnimating(false);
    if (onPress) await onPress();
  };

  return (
    <Pressable
      style={[styles.button, isAnimating && styles.buttonAnimating]}
      onPress={handlePress}
      disabled={isAnimating}
    >
      <LottieView
        ref={animationRef}
        source={require('../assets/lottie/logout.json')}
        style={styles.animation}
        loop={false}
        autoPlay={false}
        speed={3.0}
        progress={0}
        onAnimationFinish={handleAnimationFinish}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginRight: 8,
    padding: 0,
  },
  buttonAnimating: {
    backgroundColor: '#f0f0f0',
  },
  animation: {
    width: 32,
    height: 32,
  },
});

export default LottieLogoutButton; 