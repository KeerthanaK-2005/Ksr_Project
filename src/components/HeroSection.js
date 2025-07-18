import React from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, useWindowDimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { COLORS } from '../constants/colors';
import CustomButton from './CustomButton';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const HeroSection = ({ scrollY, isVisible = true }) => {
  const { height } = useWindowDimensions();

  const headerTranslateY = scrollY ? scrollY.interpolate({
    inputRange: [0, height * 0.4],
    outputRange: [0, -height * 0.2],
    extrapolate: 'clamp',
  }) : 0;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: headerTranslateY }] }
      ]}
    >
      <View style={styles.overlay}>
        {/* Background Animation */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.backgroundAnimation}
        >
          {isVisible && (
            <LottieView
              source={require('../assets/lottie/ai.json')}
              autoPlay
              loop
              style={styles.lottieBackground}
            />
          )}
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1500 }}
          style={styles.content}
        >
          {/* Main Heading with Gradient Effect */}
          <MotiText
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', duration: 1500, delay: 300 }}
            style={styles.heading}
          >
            Find Your Perfect Life Partner Here
          </MotiText>

          {/* Subheading with Fade-in Effect */}
          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 1000, delay: 800 }}
            style={styles.subheading}
          >
            Trusted by thousands of families.{'\n'}
            Safe. Verified. Personalized matches for you.
          </MotiText>

          {/* CTA Buttons with Scale Animation */}
          <View style={styles.buttonContainer}>
            <MotiView
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 1200 }}
            >
              <CustomButton
                title="Register Free"
                onPress={() => {}}
                size="large"
                style={styles.primaryButton}
              />
            </MotiView>

            <MotiView
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 1400 }}
            >
              <CustomButton
                title="View Matches"
                onPress={() => {}}
                variant="secondary"
                size="large"
                style={styles.secondaryButton}
              />
            </MotiView>
          </View>
        </MotiView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 0.9,
    backgroundColor: COLORS.neutral,
    position: 'relative',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  lottieBackground: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 30,
    width: width * 0.9,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(255, 107, 107, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subheading: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryButton: {
    minWidth: 180,
  },
  secondaryButton: {
    minWidth: 180,
  },
});

export default HeroSection;
