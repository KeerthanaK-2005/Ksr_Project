import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LottieLogoutButton from './LottieLogoutButton';

const ProfileHeader = () => {
  const [membershipType, setMembershipType] = useState('Regular');
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    // No navigation here; app state will show LandingScreen
  };

  return (
    <LinearGradient
      colors={["#FFF8F0", "#FFE9E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* Top row: pill centered, logout button right */}
      <View style={styles.topRow}>
        <View style={styles.pillCenterWrap}>
          <View style={styles.pillContainer}>
            <TouchableOpacity
              style={[styles.segment, membershipType === 'Regular' && styles.segmentActive]}
              onPress={() => setMembershipType('Regular')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, membershipType === 'Regular' && styles.segmentTextActive]}>Regular</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, membershipType === 'PRIME' && styles.segmentActive, { position: 'relative' }]}
              onPress={() => setMembershipType('PRIME')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, membershipType === 'PRIME' && styles.segmentTextActive]}>PRIME</Text>
              <View style={styles.redDot} />
            </TouchableOpacity>
          </View>
        </View>
        <LottieLogoutButton onPress={handleLogout} />
      </View>
      {/* Bottom row: avatar, info, bell, menu */}
      <View style={styles.bottomRow}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/images/avatar-placeholder.png')}
            style={styles.avatar}
          />
          <View style={styles.cameraIconWrap}>
            <FontAwesome name="camera" size={15} color="#000" />
          </View>
        </View>
        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>Ilayaraja K</Text>
          <View style={styles.memberRow}>
            <Text style={styles.free}>Free Member</Text>
            <TouchableOpacity style={styles.upgradeBtn}>
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Removed bell and menu icons */}
      </View>
    </LinearGradient>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pillCenterWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pillContainer: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: '#FFE9E0', // soft border
    overflow: 'hidden',
    alignItems: 'center',
    width: 240,
    height: 40,
    backgroundColor: '#FFF6F0', // soft background
  },
  segment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: '#FFD6E0', // soft pink for active
    shadowColor: '#FFD6E0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.2,
  },
  segmentTextActive: {
    color: '#C96A8D', // soft accent for active text
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B3B',
    position: 'absolute',
    right: 14,
    top: 10,
  },
  headerIcon: {
    marginLeft: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEE',
  },
  cameraIconWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  communityText: {
    fontSize: 13,
    color: '#222',
    fontWeight: '600',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  free: {
    fontSize: 13,
    color: '#888',
    marginRight: 8,
    fontWeight: '400',
  },
  upgradeBtn: {
    borderWidth: 1.2,
    borderColor: '#C9A14A',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
    backgroundColor: '#FFF8E1',
    marginLeft: 2,
  },
  upgradeText: {
    color: '#C9A14A',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bottomIconsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 10,
  },
  bottomIcon: {
    marginLeft: 16,
  },
  logoutBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FFD6E0', // soft pink for logout button
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD6E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#C96A8D', // soft accent for logout text
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 