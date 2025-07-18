import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  ImageBackground,
  FlatList,
  useWindowDimensions
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import WhyChooseUs from '../components/WhyChooseUs';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import SuccessStories from '../components/SuccessStories';
import PremiumMembership from '../components/PremiumMembership';
import Testimonials from '../components/Testimonials';
import SecurityTrust from '../components/SecurityTrust';
import AppPromotion from '../components/AppPromotion';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import SignUpModal from '../components/SignUpModal';
import { useTabBarVisibilityOnScroll } from '../navigation/TabBarVisibilityContext';

const { width, height } = Dimensions.get('window');

// Custom hook for parallax scroll effect
const useParallaxScroll = () => {
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  return { scrollY, scrollHandler };
};

// Dynamic typing word component
const DynamicTypingWord = () => {
  const words = ['Partner', 'Match'];
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    const currentWord = words[wordIndex];
    if (typing) {
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentWord.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 120);
      } else {
        timeout = setTimeout(() => setTyping(false), 1000);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayed(currentWord.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 60);
      } else {
        timeout = setTimeout(() => {
          setWordIndex((wordIndex + 1) % words.length);
          setTyping(true);
        }, 400);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, typing, wordIndex]);

  return (
    <Text style={{ color: '#FF69B4', fontWeight: 'bold' }}>{displayed}</Text>
  );
};

function LandingScreen() {
  const navigation = useNavigation();
  const { scrollY, scrollHandler } = useParallaxScroll();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignUpModalVisible, setSignUpModalVisible] = useState(false);
  const handleTabBarScroll = useTabBarVisibilityOnScroll();

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handlePlanPress = (index) => {
    setSelectedPlan(selectedPlan === index ? null : index);
  };

  // Parallax animated style for hero background
  const heroBackgroundStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, -150],
      Extrapolate.CLAMP
    );
    
    const scale = interpolate(
      scrollY.value,
      [0, 300],
      [1, 1.2],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [
        { translateY },
        { scale }
      ]
    };
  });

  // Parallax animated style for hero content
  const heroContentStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, 100],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [1, 0.3],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateY }],
      opacity
    };
  });

  return (
    <View style={styles.container}>
      <LoginModal 
        visible={isLoginModalVisible} 
        onClose={() => setLoginModalVisible(false)}
        onSignUp={() => {
          setLoginModalVisible(false);
          setSignUpModalVisible(true);
        }}
      />
      <SignUpModal
        visible={isSignUpModalVisible}
        onClose={() => setSignUpModalVisible(false)}
        navigation={navigation}
        onBackToLogin={() => {
          setSignUpModalVisible(false);
          setLoginModalVisible(true);
        }}
      />
      <Animated.ScrollView 
        style={styles.container}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.appName}>
            <Text style={styles.vivaahText}>Vivaah</Text>
            <Text style={styles.aiText}>Ai</Text>
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => setLoginModalVisible(true)}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Animated.View style={[styles.heroBackground, heroBackgroundStyle]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1171&auto=format&fit=crop' }}
              style={styles.heroImage}
            />
          </Animated.View>
          {/* Overlay for better text visibility */}
          <View style={styles.heroOverlay} />
          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <MotiView
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 1000,
                easing: Easing.out(Easing.cubic),
              }}
            >
              <Text style={styles.h1}>
                Find Your Perfect Life <DynamicTypingWord /> Here
              </Text>
            </MotiView>
            
            <MotiView
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 1000,
                delay: 300,
                easing: Easing.out(Easing.cubic),
              }}
            >
              <Text style={styles.h2}>
                Trusted by thousands of families.{"\n"}
                Safe. Verified. Personalized matches for you.
              </Text>
            </MotiView>
            
            <MotiView
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 1000,
                delay: 600,
                easing: Easing.out(Easing.cubic),
              }}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={() => setLoginModalVisible(true)}
                >
                  <Text style={styles.primaryButtonText}>Register Free</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>View Matches</Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </Animated.View>
        </View>
        
        {/* WHY CHOOSE US SECTION */}
        <WhyChooseUs scrollY={scrollY} />
        
        {/* SUCCESS STORIES SECTION */}
        <SuccessStories />
        
        {/* PREMIUM MEMBERSHIP SECTION */}
        <PremiumMembership />
        
        {/* TESTIMONIALS SECTION */}
        <Testimonials />
        
        {/* SECURITY & TRUST SECTION */}
        <SecurityTrust />
        
        {/* FAQ SECTION */}
        <MotiView 
          style={styles.section}
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 800,
            easing: Easing.out(Easing.cubic),
          }}
        >
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {[
            { 
              question: 'How does the matchmaking algorithm work?',
              answer: 'Our AI-powered algorithm considers your preferences, interests, background, and behavior on the app to suggest the most compatible matches for you.'
            },
            { 
              question: 'Is my personal information secure?',
              answer: 'Yes, we use bank-grade encryption to protect your data. We never share your contact information with anyone without your explicit permission.'
            },
            { 
              question: 'Can I hide my profile temporarily?',
              answer: 'Yes, you can pause your profile visibility at any time from your account settings while still being able to browse other profiles.'
            },
            { 
              question: 'How do I verify my profile?',
              answer: 'You can verify your profile by uploading a government ID and taking a selfie for our verification team to review.'
            },
            { 
              question: 'What is included in the free plan?',
              answer: 'The free plan includes basic profile creation, limited daily matches, and the ability to express interest. Premium features require a subscription.'
            }
          ].map((faq, index) => (
            <MotiView 
              key={index}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'timing',
                duration: 600,
                delay: index * 100,
                easing: Easing.out(Easing.cubic),
              }}
            >
              <TouchableOpacity 
                style={styles.faqItem}
                onPress={() => toggleFaq(index)}
              >
                <View style={styles.faqQuestion}>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <MotiView
                    animate={{ rotate: expandedFaq === index ? '180deg' : '0deg' }}
                    transition={{
                      type: 'timing',
                      duration: 300,
                      easing: Easing.out(Easing.cubic),
                    }}
                  >
                    <Text style={styles.faqToggle}>{expandedFaq === index ? '−' : '+'}</Text>
                  </MotiView>
                </View>
                {expandedFaq === index && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{
                      type: 'timing',
                      duration: 400,
                      easing: Easing.out(Easing.cubic),
                    }}
                  >
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </MotiView>
                )}
              </TouchableOpacity>
            </MotiView>
          ))}
        </MotiView>
        
        {/* APP PROMOTION SECTION */}
        <AppPromotion />
        
        {/* FOOTER SECTION */}
        <Footer />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral,
  },
  
  // HEADER STYLES
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(90deg, #fff0f6 0%, #ffe3ec 100%)',
    elevation: 4,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    zIndex: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  vivaahText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  aiText: {
    color: '#FF69B4',
    fontWeight: 'bold',
  },
  loginButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  loginText: {
    color: COLORS.neutral,
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // HERO SECTION STYLES
  heroSection: {
    height: height * 0.7,
    width: width,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.13)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    padding: 20,
  },
  h1: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  h2: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginVertical: 5,
  },
  primaryButtonText: {
    color: COLORS.neutral,
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginVertical: 5,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // SECTION COMMON STYLES
  section: {
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  
  // SUCCESS STORIES STYLES
  storiesContainer: {
    paddingHorizontal: width * 0.1, // 10% padding on each side
    paddingVertical: 20,
  },
  storyCard: {
    width: width * 0.8,
    backgroundColor: COLORS.neutral,
    borderRadius: 15,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  couplePhoto: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  storyContent: {
    padding: 15,
  },
  coupleNames: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  storyText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 5,
    lineHeight: 20,
  },
  marriageDate: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
  },
  
  // TESTIMONIALS STYLES
  testimonialsWrapper: {
    overflow: 'hidden',
    width: width,
  },
  testimonialsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: width * 6, // Ensure enough width for all cards
  },
  testimonialCard: {
    width: width * 0.8,
    backgroundColor: COLORS.neutral,
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  testimonialCardGold: {
    backgroundColor: '#FFFBF0',
    borderColor: '#FFD700',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  testimonialCardSilver: {
    backgroundColor: '#F8F8F8',
    borderColor: '#C0C0C0',
    borderWidth: 2,
    shadowColor: '#C0C0C0',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  testimonialCardPlatinum: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E4E2',
    borderWidth: 2,
    shadowColor: '#E5E4E2',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 17,
    opacity: 0.3,
    zIndex: -1,
  },
  glowGold: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  glowSilver: {
    backgroundColor: '#C0C0C0',
    shadowColor: '#C0C0C0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  glowPlatinum: {
    backgroundColor: '#E5E4E2',
    shadowColor: '#E5E4E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  testimonialPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    color: COLORS.primary,
    fontSize: 16,
    marginRight: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  
  // FAQ STYLES
  faqItem: {
    backgroundColor: COLORS.neutral,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    flex: 1,
  },
  faqToggle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 10,
    lineHeight: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  
  planTouchable: {
    flex: 1,
  },
});

export default LandingScreen; 