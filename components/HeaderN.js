import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAudio } from '../context/AudioContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  const { isMuted, toggleMute } = useAudio();

  const profileImage = 'https://randomuser.me/api/portraits/women/26.jpg'; // replace with actual image
  const userName = 'Akalya';
  const membership = 'Free Member';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        {/* Tabs Row */}
        <View style={styles.tabRow}>
          <Text style={styles.tab}>Regular</Text>
          <Text style={styles.tabSelected}>PRIME 🔴</Text>
          <Text style={styles.tabLogout}>Logout</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <View style={styles.memberRow}>
              <Text style={styles.freeMember}>{membership}</Text>
              <TouchableOpacity style={styles.upgradeBtn}>
                <Text style={styles.upgradeText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Speaker Icon */}
        <TouchableOpacity onPress={toggleMute} style={styles.speakerIcon}>
          <Icon name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffe0ec',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffe0ec',
    position: 'relative',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tab: {
    color: '#c77',
    fontWeight: '600',
  },
  tabSelected: {
    color: '#b00',
    fontWeight: 'bold',
  },
  tabLogout: {
    color: '#f00',
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  freeMember: {
    fontSize: 12,
    color: '#888',
  },
  upgradeBtn: {
    marginLeft: 10,
    backgroundColor: '#ffcb05',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  upgradeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  speakerIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#e6ffe6',
    zIndex: 10,
  },
});

export default Header;
