import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const Footer = () => {
  return (
    <MotiView 
      style={styles.footer}
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }}
    >
      <MotiView 
        style={styles.footerLinksContainer}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 800,
          delay: 200,
          easing: Easing.out(Easing.cubic),
        }}
      >
        <View style={styles.footerLinkColumn}>
          <Text style={styles.footerLinkHeader}>Company</Text>
          <TouchableOpacity><Text style={styles.footerLink}>About Us</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Careers</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Press</Text></TouchableOpacity>
        </View>
        
        <View style={styles.footerLinkColumn}>
          <Text style={styles.footerLinkHeader}>Support</Text>
          <TouchableOpacity><Text style={styles.footerLink}>Contact Us</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Help Center</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Safety Tips</Text></TouchableOpacity>
        </View>
        
        <View style={styles.footerLinkColumn}>
          <Text style={styles.footerLinkHeader}>Legal</Text>
          <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Terms of Service</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Cookie Policy</Text></TouchableOpacity>
        </View>
      </MotiView>
      
      <MotiView 
        style={styles.socialContainer}
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'timing',
          duration: 800,
          delay: 400,
          easing: Easing.out(Easing.cubic),
        }}
      >
        <Text style={styles.socialTitle}>Follow Us</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialIcon}><Text>📘</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}><Text>📸</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}><Text>🐦</Text></TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}><Text>📱</Text></TouchableOpacity>
        </View>
      </MotiView>
      
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 800,
          delay: 600,
          easing: Easing.out(Easing.cubic),
        }}
      >
        <Text style={styles.copyright}>© 2024 Matrimony App. All rights reserved.</Text>
      </MotiView>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: COLORS.secondary,
    padding: 30,
  },
  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  footerLinkColumn: {
    minWidth: width * 0.25,
    marginBottom: 20,
  },
  footerLinkHeader: {
    color: COLORS.neutral,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  footerLink: {
    color: COLORS.neutral,
    opacity: 0.8,
    marginBottom: 10,
  },
  socialContainer: {
    marginBottom: 20,
  },
  socialTitle: {
    color: COLORS.neutral,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyright: {
    color: COLORS.neutral,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Footer; 