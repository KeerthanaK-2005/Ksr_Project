import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '../constants/colors';
import Animated, { 
  useAnimatedStyle, 
  interpolate, 
  Extrapolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const BENEFITS = [
  {
    id: '1',
    title: '100% Privacy',
    description: 'Your data is encrypted and secure with us',
    animation: require('../assets/lottie/privacy.json'),
  },
  {
    id: '2',
    title: 'Verified Profiles',
    description: 'All profiles are manually verified',
    animation: require('../assets/lottie/verified.json'),
  },
  {
    id: '3',
    title: 'Intelligent Matchmaking',
    description: 'AI-powered matching algorithm',
    animation: require('../assets/lottie/ai.json'),
  },
  {
    id: '4',
    title: 'Unlimited Interests',
    description: 'Express yourself freely',
    animation: require('../assets/lottie/unlimited.json'),
  },
  {
    id: '5',
    title: '24/7 Support',
    description: 'Always here to help you',
    animation: require('../assets/lottie/support.json'),
  },
  {
    id: '6',
    title: 'Success Stories',
    description: 'Thousands of happy couples',
    animation: require('../assets/lottie/success.json'),
  },
];

const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 100;
const LINE_WIDTH = 4;

// Move AnimatedCard outside of WhyChooseUs component
const AnimatedCard = ({ item, index, scrollY }) => {
  const isLeft = index % 2 === 0;
  
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate when this card should start animating based on its position
    const cardStartY = index * 120; // Approximate position of each card
    const cardEndY = cardStartY + 200; // Animation duration
    
    const translateX = interpolate(
      scrollY.value,
      [cardStartY, cardEndY],
      isLeft ? [-CARD_WIDTH, 0] : [CARD_WIDTH, 0],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      scrollY.value,
      [cardStartY, cardEndY],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    const scale = interpolate(
      scrollY.value,
      [cardStartY, cardEndY],
      [0.8, 1],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [
        { translateX },
        { scale }
      ],
      opacity
    };
  });

  return (
    <View style={[styles.cardRow, isLeft ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' }]}>
      {/* Branch connector */}
      <View style={[styles.branch, isLeft ? styles.branchLeft : styles.branchRight]} />
      <Animated.View style={[styles.card, isLeft ? styles.cardLeft : styles.cardRight, animatedStyle]}>
        <View style={styles.lottieContainer}>
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const WhyChooseUs = ({ scrollY }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Why Choose Us</Text>
      <View style={styles.timelineContainer}>
        {/* Central vertical line */}
        <View style={styles.verticalLine} />
        {BENEFITS.map((item, index) => (
          <AnimatedCard 
            key={item.id} 
            item={item} 
            index={index} 
            scrollY={scrollY}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 40,
    minHeight: 600,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(255, 107, 107, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  timelineContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 500,
  },
  verticalLine: {
    position: 'absolute',
    left: width / 2 - LINE_WIDTH / 2,
    top: 0,
    width: LINE_WIDTH,
    height: '100%',
    backgroundColor: COLORS.primary,
    zIndex: 0,
    borderRadius: 2,
    opacity: 0.15,
  },
  cardRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    minHeight: CARD_HEIGHT,
  },
  branch: {
    position: 'absolute',
    top: '50%',
    width: width * 0.08,
    height: 2,
    backgroundColor: COLORS.primary,
    zIndex: 1,
    opacity: 0.18,
    borderRadius: 1,
  },
  branchLeft: {
    left: width / 2,
    transform: [{ translateY: -1 }],
  },
  branchRight: {
    right: width / 2,
    transform: [{ translateY: -1 }],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.neutral,
    borderRadius: 16,
    padding: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.08)',
    zIndex: 2,
  },
  cardLeft: {
    marginLeft: 0,
    marginRight: width * 0.15,
  },
  cardRight: {
    marginLeft: width * 0.15,
    marginRight: 0,
  },
  lottieContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lottie: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'left',
  },
  cardDescription: {
    color: COLORS.secondary,
    fontSize: 13,
    textAlign: 'left',
  },
});

export default WhyChooseUs;
