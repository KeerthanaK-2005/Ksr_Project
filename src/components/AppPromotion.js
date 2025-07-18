import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Linking, Alert } from 'react-native';
import { MotiView, MotiText } from 'moti';
import LottieView from 'lottie-react-native';
import { COLORS } from '../constants/colors';
import Snowfall from '../assets/Snowfall';

const { width } = Dimensions.get('window');

const AppPromotion = ({ isVisible = true }) => {
  const [androidPressed, setAndroidPressed] = useState(false);
  const [iosPressed, setIosPressed] = useState(false);

  const handleDownload = async (platform) => {
    const urls = {
      android: 'https://play.google.com/store',
      ios: 'https://apps.apple.com',
    };
    try {
      const supported = await Linking.canOpenURL(urls[platform]);
      if (supported) {
        await Linking.openURL(urls[platform]);
      } else {
        Alert.alert(
          'Cannot Open Link',
          `Your device doesn't support opening ${platform === 'android' ? 'Google Play Store' : 'App Store'}.`
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `Something went wrong while opening the ${platform === 'android' ? 'Google Play Store' : 'App Store'}.`
      );
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 60 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 1200 }}
      style={styles.container}
    >
      <MotiView
        from={{ opacity: 0.18, scale: 0.8 }}
        animate={{ opacity: [0.12, 0.22, 0.12], scale: [0.8, 1.1, 0.8] }}
        transition={{ loop: true, type: 'timing', duration: 2600 }}
        style={styles.blackCircle}
        pointerEvents="none"
      />
      <MotiView
        from={{ opacity: 0.18, scale: 0.8 }}
        animate={{ opacity: [0.12, 0.22, 0.12], scale: [0.8, 1.1, 0.8] }}
        transition={{ loop: true, type: 'timing', duration: 2600 }}
        style={styles.blackCircleSmall}
        pointerEvents="none"
      />
      <MotiView
        from={{ opacity: 0.25, scale: 0.8 }}
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.8, 1.1, 0.8] }}
        transition={{ loop: true, type: 'timing', duration: 2800, delay: 300 }}
        style={styles.redCircleTopRight}
        pointerEvents="none"
      />
      <MotiText
        from={{ opacity: 0, scale: 0.7, color: COLORS.secondary }}
        animate={{ opacity: 1, scale: 1, color: COLORS.primary }}
        transition={{ type: 'spring', duration: 1200, delay: 200 }}
        style={styles.title}
      >
        Matrimony on the Go
      </MotiText>

      <View style={styles.animationOuterContainer}>
        <MotiView
          from={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.1, 0.8] }}
          transition={{ loop: true, type: 'timing', duration: 2600 }}
          style={styles.glow}
        />
        <MotiView
          from={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 400 }}
          style={styles.animationContainer}
        >
          {isVisible && (
            <LottieView
              source={require('../assets/lottie/ai.json')}
              autoPlay
              loop
              style={styles.animation}
            />
          )}
        </MotiView>
        <View style={styles.snowfallWrapper} pointerEvents="none">
          <Snowfall />
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <MotiView
          from={{ opacity: 0, translateX: -60 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: 600 }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              styles.androidButton,
              androidPressed && styles.buttonPressed
            ]}
            activeOpacity={0.85}
            onPressIn={() => setAndroidPressed(true)}
            onPressOut={() => setAndroidPressed(false)}
            onPress={() => handleDownload('android')}
          >
            <MotiText
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 700 }}
              style={styles.buttonText}
            >
              Download for Android
            </MotiText>
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateX: 60 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: 800 }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              styles.iosButton,
              iosPressed && styles.buttonPressed
            ]}
            activeOpacity={0.85}
            onPressIn={() => setIosPressed(true)}
            onPressOut={() => setIosPressed(false)}
            onPress={() => handleDownload('ios')}
          >
            <MotiText
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 900 }}
              style={styles.buttonText}
            >
              Download for iOS
            </MotiText>
          </TouchableOpacity>
        </MotiView>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  blackCircle: {
    position: 'absolute',
    top: 54,
    left: width * 0.13,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000',
    opacity: 0.12,
    zIndex: 0,
  },
  blackCircleSmall: {
    position: 'absolute',
    top: 295,
    left: 24,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    opacity: 0.12,
    zIndex: 0,
  },
  redCircleTopRight: {
    position: 'absolute',
    top: 130,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFB6C1',
    opacity: 0.25,
    zIndex: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(255, 107, 107, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  animationOuterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: width * 0.62,
    height: width * 0.62,
    borderRadius: width * 0.31,
    backgroundColor: '#FFB6C1',
    opacity: 0.35,
    zIndex: 0,
    transform: [{ translateX: -(width * 0.31) }, { translateY: -(width * 0.31) }],
  },
  animationContainer: {
    width: width * 0.6,
    height: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    marginHorizontal: 8,
    marginVertical: 4,
    elevation: 2,
  },
  androidButton: {
    backgroundColor: COLORS.primary,
  },
  iosButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.neutral,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  snowfallWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default AppPromotion; 