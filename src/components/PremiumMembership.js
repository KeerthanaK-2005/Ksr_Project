import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, PanResponder, Alert } from 'react-native';
import { MotiView, MotiText } from 'moti';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.68;
const CARD_ASPECT_RATIO = 1.6;
const CARD_HEIGHT = CARD_WIDTH * CARD_ASPECT_RATIO;

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'Forever',
    icon: '🎁',
    color: '#F5F7FA', // Light Grey
    description: 'Best for getting started',
    features: [
      'Basic features', 'Weekly reports',
      'Limited access', 'Email notifications',
      'Community support', 'Profile customization'
    ],
    popular: false
  },
  {
    name: 'Premium',
    price: '₹499',
    period: 'Month',
    icon: '⭐',
    color: '#E9F5FE', // Light Blue
    description: 'For users who want more',
    features: [
      'All Free features', 'Advanced search',
      'Premium content', 'Profile boost',
      'Priority support', 'No ads'
    ],
    popular: false
  },
  {
    name: 'Gold',
    price: '₹999',
    period: 'Month',
    icon: '👑',
    color: '#FFFBEA', // Light Cream
    description: 'The most popular choice',
    features: [
      'All Premium features', 'See who likes you',
      'Advanced analytics', 'Read receipts',
      'No ads', 'Video calls'
    ],
    popular: true
  },
  {
    name: 'Pro',
    price: '₹1999',
    period: 'Month',
    icon: '🚀',
    color: '#F6F3FE', // Light Lavender
    description: 'For power users',
    features: [
      'All Gold features', 'Dedicated manager',
      'Custom integrations', 'Incognito mode',
      '24/7 support', 'Background verification'
    ],
    popular: false
  }
];

const PremiumMembership = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with 'Gold' plan
  const intervalRef = useRef(null);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % plans.length);
    }, 5000);
  }, [stopAutoScroll]);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  const handlePlanSelection = useCallback((plan) => {
    if (plan.name === 'Free') {
      Alert.alert('Free Plan', 'You can continue with the free plan!');
    } else {
      Alert.alert(
        'Choose Plan',
        `Would you like to subscribe to ${plan.name} plan for ${plan.price}/${plan.period}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Subscribe', 
            onPress: () => {
              Alert.alert('Success', `Subscribed to ${plan.name} plan!`);
            }
          }
        ]
      );
    }
  }, []);

  const panResponder = useMemo(() =>
    PanResponder.create({
      onPanResponderGrant: () => {
        stopAutoScroll();
      },
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) { // Swipe Right
          setCurrentIndex(prev => (prev - 1 + plans.length) % plans.length);
        } else if (gestureState.dx < -50) { // Swipe Left
          setCurrentIndex(prev => (prev + 1) % plans.length);
        }
        setTimeout(startAutoScroll, 5000); // Restart after 5s
      },
    }),
    [startAutoScroll, stopAutoScroll]
  );

  return (
    <MotiView
      style={styles.section}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 600 }}
    >
      <View style={styles.pagination}>
        {plans.map((_, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              setCurrentIndex(idx);
              stopAutoScroll();
              setTimeout(startAutoScroll, 5000);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              style={[
                styles.dot,
                idx === currentIndex && styles.activeDot
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Premium Membership</Text>
      <Text style={styles.sectionSubtitle}>Unlock Premium Benefits</Text>
      
      <View style={styles.carouselContainer} {...panResponder.panHandlers}>
        {plans.map((plan, index) => {
          let offset = index - currentIndex;
          if (offset > plans.length / 2) offset -= plans.length;
          if (offset < -plans.length / 2) offset += plans.length;

          const isCurrent = index === currentIndex;
          const absOffset = Math.abs(offset);

          const scale = 0.95 - absOffset * 0.1;
          const opacity = 1 - absOffset * 0.3;
          const zIndex = plans.length - absOffset;
          const rotateY = `${offset * -15}deg`;
          const translateX = offset * (CARD_WIDTH * 0.6);

          return (
            <MotiView
              key={plan.name}
              style={[
                styles.planCard,
                {
                  backgroundColor: plan.color,
                  borderColor: plan.popular ? '#FFCA28' : 'rgba(0,0,0,0.1)',
                  zIndex,
                }
              ]}
              animate={{
                transform: [{ rotateY }, { translateX }, { scale }],
                opacity,
              }}
              transition={{
                type: 'timing',
                duration: 800,
              }}
              pointerEvents={isCurrent ? 'auto' : 'none'}
            >
              <View style={styles.planIconWrapper}>
                <Text style={styles.planIcon}>{plan.icon}</Text>
              </View>

              {plan.popular && (
                <View style={styles.popularTag}>
                  <Text style={styles.popularTagText}>Most Popular</Text>
                </View>
              )}

              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPeriod}>{plan.period}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>

              <View style={styles.featuresContainer}>
                <View style={styles.featuresColumn}>
                  {plan.features.filter((_, i) => i % 2 === 0).map((feature, idx) => (
                    <FeatureItem key={idx} feature={feature} isCurrent={isCurrent} delay={idx * 80} />
                  ))}
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.featuresColumn}>
                  {plan.features.filter((_, i) => i % 2 !== 0).map((feature, idx) => (
                    <FeatureItem key={idx} feature={feature} isCurrent={isCurrent} delay={idx * 80 + 40} />
                  ))}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.planButton,
                    plan.popular ? styles.primaryButton : styles.secondaryButton
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handlePlanSelection(plan)}
                >
                  <Text style={plan.popular ? styles.primaryButtonText : styles.secondaryButtonText}>
                    Choose Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          );
        })}
      </View>
    </MotiView>
  );
};

const FeatureItem = ({ feature, isCurrent, delay }) => (
  <MotiText
    from={{ opacity: 0, translateX: -20 }}
    animate={{ opacity: isCurrent ? 1 : 0, translateX: isCurrent ? 0 : -20 }}
    transition={{ type: 'timing', duration: 300, delay }}
    style={styles.featureRow}
  >
    <Text style={styles.featureCheck}>✓</Text>
    <Text style={styles.featureText}>{feature}</Text>
  </MotiText>
);

const styles = StyleSheet.create({
  section: {
    paddingVertical: 30,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    backgroundColor: '#FFCA28',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#212121',
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#757575',
  },
  carouselContainer: {
    height: CARD_HEIGHT + 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  planCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    elevation: 12,
  },
  planIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planIcon: {
    fontSize: 32,
  },
  planName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  planDescription: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  featuresContainer: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    paddingHorizontal: 10,
  },
  featuresColumn: {
    flex: 1,
  },
  verticalLine: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 10,
  },
  planFeatures: {
    alignSelf: 'flex-start',
    width: '100%',
    flex: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCheck: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: '#424242',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 16,
  },
  planButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#FFCA28',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  popularTag: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFCA28',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 1,
  },
  popularTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#212121',
  },
});

export default PremiumMembership; 