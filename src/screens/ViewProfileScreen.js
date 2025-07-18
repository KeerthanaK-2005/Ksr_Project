import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import profileService from '../services/profileService';

const PRIMARY = '#FF6B6B';
const NEUTRAL = '#FFFFFF';

const ViewProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { matrimonyId } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    profileService.getProfileByMatrimonyId(matrimonyId)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Profile not found');
        setLoading(false);
      });
  }, [matrimonyId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={28} color={PRIMARY} />
        </TouchableOpacity>
        <Icon name="person-circle-outline" size={32} color={PRIMARY} style={{ marginRight: 8, marginLeft: 4 }} />
        <Text style={styles.headerTitle}>Profile Details</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: PRIMARY, textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : (
        <View style={styles.profileCard}>
          <Image source={{ uri: profile.photo }} style={styles.profilePhoto} />
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileInfo}>{profile.age} yrs</Text>
          <Text style={styles.profileInfo}>{profile.matrimonyId}</Text>
          <Text style={styles.profileInfo}>{profile.location}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEUTRAL,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: NEUTRAL,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    margin: 24,
    elevation: 2,
    shadowColor: PRIMARY,
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: '#EEE',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileInfo: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default ViewProfileScreen; 