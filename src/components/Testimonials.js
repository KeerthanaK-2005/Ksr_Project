import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const testimonials = [
  {
    name: 'Anita S.',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    review: 'Found my soulmate within 2 months of joining. The verification process made me feel safe.'
  },
  {
    name: 'Rajesh K.',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
    review: 'Great matchmaking algorithm. The suggestions were very relevant to my preferences.'
  },
  {
    name: 'Priyanka M.',
    photo: 'https://randomuser.me/api/portraits/women/67.jpg',
    rating: 5,
    review: 'The premium membership was worth every rupee. Found my partner in just 3 months!'
  },
];

const Testimonials = () => {
  // Duplicate testimonials for seamless loop
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
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
      <Text style={styles.sectionTitle}>Testimonials</Text>
      <View style={styles.testimonialsWrapper}>
        <MotiView 
          style={styles.testimonialsContainer}
          from={{ translateX: 0 }}
          animate={{ translateX: -width * 2 }}
          transition={{
            type: 'timing',
            duration: 20000,
            loop: true,
            easing: Easing.linear,
          }}
        >
          {allTestimonials.map((testimonial, index) => (
            <MotiView 
              key={index} 
              style={[
                styles.testimonialCard,
                index % 3 === 0 && styles.testimonialCardGold,
                index % 3 === 1 && styles.testimonialCardSilver,
                index % 3 === 2 && styles.testimonialCardPlatinum
              ]}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                delay: index * 100,
                damping: 20,
              }}
            >
              {/* Glowing background effect */}
              <MotiView
                style={[
                  styles.glowEffect,
                  index % 3 === 0 && styles.glowGold,
                  index % 3 === 1 && styles.glowSilver,
                  index % 3 === 2 && styles.glowPlatinum
                ]}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{
                  type: 'timing',
                  duration: 3000,
                  loop: true,
                  easing: Easing.inOut(Easing.ease),
                }}
              />
              <View style={styles.testimonialHeader}>
                <Image 
                  source={{ uri: testimonial.photo }}
                  style={styles.testimonialPhoto}
                />
                <View>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <MotiView
                        key={star}
                        from={{ scale: 0, rotate: '-180deg' }}
                        animate={{ scale: 1, rotate: '0deg' }}
                        transition={{
                          type: 'spring',
                          delay: index * 100 + (star * 50),
                          damping: 15,
                        }}
                      >
                        <Text style={styles.starIcon}>
                          {star <= testimonial.rating ? '★' : '☆'}
                        </Text>
                      </MotiView>
                    ))}
                  </View>
                </View>
              </View>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  delay: index * 100 + 300,
                  damping: 20,
                }}
              >
                <Text style={styles.testimonialText}>
                  "{testimonial.review}"
                </Text>
              </MotiView>
            </MotiView>
          ))}
        </MotiView>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
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
  testimonialsWrapper: {
    overflow: 'hidden',
    width: width,
  },
  testimonialsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: width * 6,
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
});

export default Testimonials; 