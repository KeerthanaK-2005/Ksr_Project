import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useTabBarVisibilityOnScroll } from '../navigation/TabBarVisibilityContext';

const PRIMARY = '#FF6B6B';
const NEUTRAL = '#FFFFFF';
// Update card/photo constants to match DailyRecommendation
const CARD_RADIUS = 18;
const CARD_HEIGHT = 130;
const CARD_WIDTH = 160;

// TODO: Replace with API fetching in the future
export const allMatches = [
  {
    id: 5,
    name: 'Amit Kumar',
    age: 28,
    location: 'Delhi',
    photos: [
      'https://randomuser.me/api/portraits/men/46.jpg',
      'https://randomuser.me/api/portraits/men/47.jpg',
    ],
  },
  {
    id: 6,
    name: 'Sneha Reddy',
    age: 25,
    location: 'Pune',
    photos: [
      'https://randomuser.me/api/portraits/women/68.jpg',
      'https://randomuser.me/api/portraits/women/69.jpg',
    ],
  },
  {
    id: 7,
    name: 'Karthik Iyer',
    age: 31,
    location: 'Coimbatore',
    photo: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
  {
    id: 8,
    name: 'Meera Joshi',
    age: 27,
    location: 'Kolkata',
    photo: 'https://randomuser.me/api/portraits/women/69.jpg',
  },
  {
    id: 9,
    name: 'Rohan Das',
    age: 29,
    location: 'Jaipur',
    photo: 'https://randomuser.me/api/portraits/men/48.jpg',
  },
  {
    id: 10,
    name: 'Divya Nair',
    age: 26,
    location: 'Trivandrum',
    photo: 'https://randomuser.me/api/portraits/women/70.jpg',
  },
];

const addProfileExtras = (profile, idx) => ({
  ...profile,
  matrimonyId: profile.matrimonyId || `M00000${profile.id}`,
  photos: profile.photos ? profile.photos : [profile.photo],
  isOnline: idx % 2 === 0,
  lastSeen: idx % 2 === 0 ? null : `${10 + idx} mins ago`,
  isVerified: idx % 3 === 0,
  isPremium: idx % 4 === 0,
  matchScore: 80 + (idx % 20),
});
const allProfilesWithExtras = allMatches.map(addProfileExtras);

const ProfileCard = React.memo(({ profile, onViewProfile }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };
  const scrollViewRef = useRef(null);
  const images = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.photo];
  const hasMultipleImages = images.length > 1;

  // Handle scroll to update current photo index
  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const imageWidth = CARD_WIDTH;
    const newIndex = Math.round(contentOffset / imageWidth);
    setPhotoIndex(newIndex);
  };

  return (
    <View style={styles.profileCardModern}>
      {/* Left: Photo(s) + online status */}
      <View style={styles.profileCardPhotoCol}>
        <View style={styles.profileCardPhotoWrap}>
          {hasMultipleImages ? (
            <FlatList
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, idx) => `${profile.matrimonyId}-img-${idx}`}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.profileCardPhoto} />
              )}
              style={{ height: '100%' }}
              contentContainerStyle={{ height: '100%' }}
              pagingEnabled
              initialScrollIndex={0}
              getItemLayout={(_, index) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * index, index })}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              removeClippedSubviews={false}
              windowSize={2}
              initialNumToRender={5}
            />
          ) : (
            <Image source={{ uri: images[0] }} style={styles.profileCardPhoto} />
          )}
          {/* Online status dot */}
          <View style={[styles.onlineDot, { backgroundColor: profile.isOnline ? '#1DBF73' : '#bbb' }]} />
          {hasMultipleImages && (
            <View style={styles.profileCardPhotoDotsRow}>
              {images.map((_, idx) => (
                <View key={idx} style={[styles.profileCardPhotoDot, photoIndex === idx && styles.profileCardPhotoDotActive]} />
              ))}
            </View>
          )}
        </View>
      </View>
      {/* Right: Details */}
      <View style={styles.profileCardDetailsCol}>
        <Text style={styles.profileCardName}>{profile.name ? String(profile.name) : ''}</Text>
        <Text style={styles.profileCardMeta}>{profile.matrimonyId ? String(profile.matrimonyId) : ''}  ·  {profile.age ? `${profile.age} yrs` : ''}  ·  {profile.location ? String(profile.location) : ''}</Text>
        {/* Badges row */}
        <View style={styles.profileCardBadgesRow}>
          {profile.isVerified && (
            <MaterialCommunityIcons name="shield-check" size={18} color="#1DBF73" style={styles.profileCardBadgeIcon} />
          )}
          {profile.isPremium && (
            <MaterialCommunityIcons name="crown" size={18} color="#FFD700" style={styles.profileCardBadgeIcon} />
          )}
          <View style={styles.profileCardMatchScoreWrap}>
            <Feather name="activity" size={16} color="#4AC29A" />
            <Text style={styles.profileCardMatchScoreText}>{profile.matchScore !== undefined && profile.matchScore !== null ? String(profile.matchScore) : ''}%</Text>
          </View>
        </View>
        {/* Action icons row */}
        <View style={styles.profileCardActionsRow}>
          <TouchableOpacity style={styles.profileCardActionBtn} onPress={onViewProfile}>
            <Feather name="eye" size={24} color="#4AC29A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCardActionBtn}>
            <Feather name="slash" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCardActionBtn}>
            <Feather name="heart" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Status indicator on right */}
      <View style={styles.profileCardStatusContainer}>
        <View style={[styles.profileCardStatusDot, { backgroundColor: profile.isOnline ? '#1DBF73' : '#bbb' }]} />
        {profile.isOnline ? (
          <Text style={styles.profileCardStatusText}>Online</Text>
        ) : (
          <Text style={styles.profileCardStatusTextOffline}>{profile.lastSeen ? String(profile.lastSeen) : ''}</Text>
        )}
      </View>
    </View>
  );
});

const MatchesScreen = () => {
  const handleTabBarScroll = useTabBarVisibilityOnScroll();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(allProfilesWithExtras);

  React.useEffect(() => {
    if (!search.trim()) {
      setFiltered(allProfilesWithExtras);
    } else {
      const lower = search.toLowerCase().replace(/\s+/g, '');
      setFiltered(
        allProfilesWithExtras.filter(
          p =>
            (p.name && p.name.toLowerCase().replace(/\s+/g, '').includes(lower)) ||
            (p.matrimonyId && p.matrimonyId.toLowerCase().replace(/\s+/g, '').includes(lower)) ||
            (p.location && p.location.toLowerCase().replace(/\s+/g, '').includes(lower))
        )
      );
    }
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="people-outline" size={28} color={PRIMARY} style={{ marginRight: 8 }} />
        <Text style={styles.headerTitle}>All Matches</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.modalSearchBarWrap}>
        <Icon name="search" size={22} color={PRIMARY} style={{ marginRight: 6 }} />
        <TextInput
          style={styles.modalSearchInput}
          placeholder="Search by name, matrimony ID, or location"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
        />
      </View>
      {/* List */}
      <FlatList
        data={filtered}
        renderItem={({ item }) => <ProfileCard profile={item} onViewProfile={() => {}} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={true}
        onScroll={handleTabBarScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 }}><Text style={{ color: '#888', fontSize: 18, textAlign: 'center' }}>No matches found</Text></View>}
      />
    </View>
  );
};

// Update styles to match DailyRecommendation
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  profileCardModern: {
    flexDirection: 'row',
    backgroundColor: '#F7F7FA',
    borderRadius: 18,
    marginVertical: 8,
    marginHorizontal: 4,
    minHeight: 130,
    maxHeight: 130,
    height: 130,
    alignItems: 'center',
    padding: 0,
    overflow: 'hidden',
  },
  profileCardPhotoCol: {
    width: 160,
    height: '100%',
    backgroundColor: '#E3F6FC',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    padding: 0,
    margin: 0,
  },
  profileCardPhotoWrap: {
    position: 'relative',
    width: 160,
    height: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    margin: 0,
    backgroundColor: '#E3F6FC',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 0,
  },
  profileCardPhoto: {
    width: 160,
    height: '100%',
    borderRadius: 18,
    resizeMode: 'cover',
    margin: 0,
    padding: 0,
  },
  onlineDot: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileCardPhotoDotsRow: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  profileCardPhotoDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    opacity: 0.5,
  },
  profileCardPhotoDotActive: {
    backgroundColor: '#4AC29A',
    opacity: 1,
  },
  profileCardDetailsCol: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  profileCardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  profileCardMeta: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  profileCardBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
    marginTop: 2,
  },
  profileCardBadgeIcon: {
    marginRight: 4,
    marginLeft: 0,
  },
  profileCardMatchScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 2,
  },
  profileCardMatchScoreText: {
    fontSize: 10,
    color: '#4AC29A',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  profileCardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    gap: 18,
  },
  profileCardActionBtn: {
    backgroundColor: '#F7F7FA',
    borderRadius: 20,
    padding: 8,
    marginRight: 0,
    elevation: 1,
  },
  profileCardStatusContainer: {
    position: 'absolute',
    right: 18,
    top: '50%',
    transform: [{ translateY: -12 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  profileCardStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  profileCardStatusText: {
    fontSize: 12,
    color: '#1DBF73',
    fontWeight: 'bold',
  },
  profileCardStatusTextOffline: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  modalSearchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 12,
    marginBottom: 18,
    marginHorizontal: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 15,
    color: PRIMARY,
    paddingVertical: 4,
    paddingLeft: 8,
    backgroundColor: 'transparent',
  },
});

export default MatchesScreen; 