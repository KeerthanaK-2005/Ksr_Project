import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';
import LottieView from 'lottie-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.48;
const ICON_SIZE = 56;
const ICON_GAP = 70;
const CENTER_X = width / 2;
const CIRCLE_TOP = 64;
const CENTER_Y = CIRCLE_TOP + CIRCLE_SIZE / 2;
const ICON_RADIUS = (CIRCLE_SIZE / 2) + ICON_GAP;

// Restore original icon data
const ICONS = [
  {
    label: '24/7 Support',
    lottie: require('../assets/lottie/24h support.json'),
    description: 'Our team is always available to help you.',
    angle: -90, // Top
  },
  {
    label: 'ID Verification',
    lottie: require('../assets/lottie/id verification.json'),
    description: 'We verify all profiles before they go live.',
    angle: 0, // Right
  },
  {
    label: 'DPP',
    lottie: require('../assets/lottie/data privacy.json'),
    description: 'We employ advanced data protection protocols to safeguard your information.',
    angle: 90, // Bottom
  },
  {
    label: 'Secure Payments',
    lottie: require('../assets/lottie/securepayments.json'),
    description: 'All transactions are encrypted and secure.',
    angle: 180, // Left
  },
];

const STEP_DURATION = 3500; // 3.5 seconds between steps (slower)
const ANIMATION_DURATION = 1200; // 1.2 seconds for smooth move

// Separate component for each icon to fix hook usage
const IconComponent = ({ item, idx, rotation, bottomIdx, isVisible }) => {
  const animatedStyle = useAnimatedStyle(() => {
    let extraY = 0;
    const effectiveAngle = (item.angle + rotation.value) % 360;
    if (Math.abs(((effectiveAngle + 360) % 360) - 90) < 10) {
      extraY = -10;
    }
    const angle = (effectiveAngle) * (Math.PI / 180);
    return {
      position: 'absolute',
      left: CENTER_X + ICON_RADIUS * Math.cos(angle) - ICON_SIZE / 2,
      top: CENTER_Y + ICON_RADIUS * Math.sin(angle) - ICON_SIZE / 2 + extraY,
    };
  });

  return (
    <Animated.View
      key={item.label}
      style={[styles.iconWrapper, animatedStyle]}
    >
      <View style={[styles.iconCircle, idx === bottomIdx && styles.selectedIconCircle]}> 
        {isVisible && (
          <LottieView
            source={item.lottie}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}
      </View>
      <Text style={styles.iconLabel}>{item.label}</Text>
    </Animated.View>
  );
};

const SecurityTrust = ({ isVisible = true }) => {
  // Step index: 0, 1, 2, 3 (rotates icons)
  const [step, setStep] = useState(0);
  const rotation = useSharedValue(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStep((prev) => (prev + 1) % ICONS.length);
    }, STEP_DURATION);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Animate rotation to the new step
  useEffect(() => {
    rotation.value = withTiming(step * 90, { duration: ANIMATION_DURATION });
  }, [step, rotation]);

  // Find which icon is at the bottom (angle 90)
  const getBottomIdx = () => {
    let minDiff = 999;
    let idx = 0;
    for (let i = 0; i < ICONS.length; i++) {
      let effectiveAngle = (ICONS[i].angle + step * 90) % 360;
      if (effectiveAngle < 0) {
        effectiveAngle += 360;
      }
      let diff = Math.abs(effectiveAngle - 90);
      if (diff > 180) {
        diff = 360 - diff;
      }
      if (diff < minDiff) {
        minDiff = diff;
        idx = i;
      }
    }
    return idx;
  };
  const bottomIdx = getBottomIdx();

  // Animated position for the line from bottom icon to description box
  const bottomIconPos = useAnimatedStyle(() => {
    const angle = ((ICONS[bottomIdx].angle + rotation.value) % 360) * (Math.PI / 180);
    const isBottom = Math.abs((((ICONS[bottomIdx].angle + rotation.value) % 360) + 360) % 360 - 90) < 10;
    const extraY = isBottom ? 18 : 0;
    // Start the line just below the icon (add ICON_SIZE/2 + 26 for a bigger gap)
    return {
      left: CENTER_X + ICON_RADIUS * Math.cos(angle) - ICON_SIZE / 2 + ICON_SIZE / 2 - 1,
      top: CENTER_Y + ICON_RADIUS * Math.sin(angle) - ICON_SIZE / 2 + ICON_SIZE + extraY + 26,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Security & Trust</Text>
      <View style={styles.diagramWrapper}>
        {/* Main center circle with gradient */}
        <View style={[styles.circle, { top: CIRCLE_TOP, left: CENTER_X - CIRCLE_SIZE / 2 }]}> 
          <Text style={styles.circleText}>{'Your Security \n Our Priority'}</Text>
        </View>
        {/* Icons around the circle */}
        {ICONS.map((item, idx) => (
          <IconComponent
            key={item.label}
            item={item}
            idx={idx}
            rotation={rotation}
            bottomIdx={bottomIdx}
            isVisible={isVisible}
          />
        ))}
        {/* Line from bottom icon to description box */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 2,
              height: 28, // slightly longer for better connection
              backgroundColor: COLORS.primary,
              zIndex: 0,
            },
            bottomIconPos,
          ]}
        />
      </View>
      {/* Description Box */}
      <View style={[styles.cardWrapper, { marginTop: 16 }]}> 
        <View style={styles.cardIconCircle}>
          {isVisible && (
            <LottieView
              source={ICONS[bottomIdx].lottie}
              autoPlay
              loop
              style={styles.lottieSmall}
            />
          )}
        </View>
        <View style={styles.cardTextWrapper}>
          <Text style={styles.cardTitle}>{ICONS[bottomIdx].label}</Text>
          <Text style={styles.cardDesc}>{ICONS[bottomIdx].description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.neutral,
    paddingTop: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 48,
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  diagramWrapper: {
    width: width,
    height: CIRCLE_TOP + CIRCLE_SIZE + ICON_GAP + ICON_SIZE / 2 + 60,
    position: 'relative',
    marginBottom: 8,
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.neutral,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    zIndex: 1,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  circleText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.2,
  },
  iconWrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: ICON_SIZE + 8,
    zIndex: 2,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: COLORS.neutral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIconCircle: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.neutral,
    borderWidth: 2.5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  lottie: {
    width: ICON_SIZE * 0.7,
    height: ICON_SIZE * 0.7,
  },
  iconLabel: {
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
  cardWrapper: {
    backgroundColor: COLORS.neutral,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.2,
    borderColor: COLORS.primary,
  },
  cardIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.neutral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.2,
    borderColor: COLORS.primary,
  },
  lottieSmall: {
    width: 22,
    height: 22,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.secondary,
    opacity: 0.85,
    lineHeight: 19,
  },
});

export default SecurityTrust;