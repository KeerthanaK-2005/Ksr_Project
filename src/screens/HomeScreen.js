import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileHeader from '../components/ProfileHeader';
import DailyRecommendation from '../components/DailyRecommendation';
import MatchesScreen from './MatchesScreen'; // Import to access allMatches
import { allMatches } from './MatchesScreen';
import DetailsScreen from '../components/EventDetailsScreen';
import { useTabBarVisibilityOnScroll } from '../navigation/TabBarVisibilityContext';

const PRIMARY = '#FF6B6B';
const SECONDARY = '#000000';
const NEUTRAL = '#FFFFFF';
const { width } = Dimensions.get('window');
const CARD_RADIUS = 20;
const CARD_HEIGHT = 220;
const CARD_WIDTH = 150;

// ProfilePreviewCard component (restored)
const ProfilePreviewCard = ({ profile, onBodyPress, setOuterScrollEnabled }) => {
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const scrollViewRef = React.useRef(null);

  // Handle scroll to update current photo index
  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const imageWidth = CARD_WIDTH;
    const newIndex = Math.round(contentOffset / imageWidth);
    setPhotoIndex(newIndex);
  };

  // Get images array - use photos if available, otherwise [photo]
  const images = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.photo];
  const hasMultipleImages = images.length > 1;

  // Touch handlers to control outer FlatList scroll
  const handleTouchStart = () => setOuterScrollEnabled && setOuterScrollEnabled(false);
  const handleTouchEnd = () => setOuterScrollEnabled && setOuterScrollEnabled(true);

  return (
    <View style={[styles.recommendCard, { width: CARD_WIDTH }]}> {/* Fixed width for card */}
      {/* Image area: swipeable if multiple images */}
      <View
        style={{ position: 'relative', width: CARD_WIDTH, height: CARD_HEIGHT * 0.56 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {hasMultipleImages ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ width: CARD_WIDTH * images.length }}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT * 0.56 }}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[
                  styles.cardImage,
                  {
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT * 0.56,
                    borderTopLeftRadius: CARD_RADIUS,
                    borderTopRightRadius: CARD_RADIUS,
                    borderBottomLeftRadius: CARD_RADIUS,
                    borderBottomRightRadius: 0,
                    margin: 0,
                    padding: 0,
                  },
                ]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) :
          <Image
            source={{ uri: images[0] }}
            style={[
              styles.cardImage,
              {
                width: CARD_WIDTH,
                height: CARD_HEIGHT * 0.56,
                borderTopLeftRadius: CARD_RADIUS,
                borderTopRightRadius: CARD_RADIUS,
                borderBottomLeftRadius: CARD_RADIUS,
                borderBottomRightRadius: 0,
                margin: 0,
                padding: 0,
              },
            ]}
            resizeMode="cover"
          />
        }
        {/* Indicator dots for multiple images */}
        {hasMultipleImages && (
          <View style={styles.previewCardDotsRow}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.previewCardDot,
                  photoIndex === idx && styles.previewCardDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
      {/* Card body: only this is touchable for navigation */}
      <TouchableOpacity style={styles.cardContent} activeOpacity={0.85} onPress={onBodyPress}>
        <Text style={styles.name}>{profile.name ? String(profile.name) : ''}</Text>
        {profile.matrimonyId ? <Text style={styles.matrimonyId}>{String(profile.matrimonyId)}</Text> : null}
        <Text style={styles.details}>{profile.age ? `${profile.age} yrs` : ''}</Text>
        <Text style={styles.details}>{profile.location ? String(profile.location) : ''}</Text>
      </TouchableOpacity>
    </View>
  );
};

// For preview cards, use:
const previewMatches = allMatches.slice(0, 4);

const HomeScreen = ({ navigation }) => {
  const handleTabBarScroll = useTabBarVisibilityOnScroll();

  // For preview cards, use:
  const previewMatches = allMatches.slice(0, 4);

  // Compose header for FlatList
  const renderHeader = () => (
    <>
      <ProfileHeader />
      <DailyRecommendation />
      {/* All Matches Section */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <View>
            <Text style={styles.sectionTitle}>All Matches</Text>
            <Text style={styles.sectionSubtitle}>Members who match your partner preferences</Text>
          </View>
        </View>
        {/* Preview cards */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          {previewMatches.map((item) => (
            <ProfilePreviewCard
              key={item.id}
              profile={item}
              onBodyPress={() => navigation.navigate('ViewProfile', { matrimonyId: item.matrimonyId })}
            />
          ))}
          {/* Always show the blurred/locked card as the 4th card */}
          <TouchableOpacity style={styles.lockedCard} activeOpacity={0.85} onPress={() => navigation.navigate('Matches')}>
            <View style={styles.lockedImage}>
              <View style={styles.lockedBlur} />
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.lockedViewAllText}>View all</Text>
                <Icon name="chevron-forward" size={16} color={PRIMARY} style={{marginLeft: 4}} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Full-width View all button */}
        <TouchableOpacity style={styles.fullViewAllBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Matches')}>
          <View style={styles.fullViewAllOutline}>
            <Text style={styles.fullViewAllText}>View all {'>'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Upcoming Events Section */}
      <View style={{ marginTop: 40 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 0, marginLeft: 16 }}>
          Upcoming Events
        </Text>
        <Text style={{ color: '#888', fontSize: 15, marginTop: 2, marginLeft: 16 }}>
          Don't miss these special celebrations near you.
        </Text>
        <DetailsScreen navigation={navigation} />
      </View>
    </>
  );

  return (
    <FlatList
      data={[]} // No main data, just header for now
      renderItem={null}
      keyExtractor={() => ''}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      onScroll={handleTabBarScroll}
      scrollEventThrottle={16}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEUTRAL,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SECONDARY,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
    marginBottom: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 8,
    height: 44,
  },
  timerBadgeTrapezium: {
    height: 44,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  timerBadgeSlant: {
    position: 'absolute',
    left: -22,
    width: 0,
    height: 0,
    borderTopWidth: 44,
    borderTopColor: 'transparent',
    borderRightWidth: 22,
    borderRightColor: '#FF6B6B', // match gradient start
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    zIndex: 2,
  },
  timerBadgeInner: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 3,
  },
  timerBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  timerBadgeTime: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  recommendCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#F7F7FA',
    alignItems: 'center',
    padding: 0,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: PRIMARY,
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: '58%',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    resizeMode: 'cover',
    backgroundColor: '#EEE',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  matrimonyId: {
    fontSize: 10,
    color: '#888',
    marginLeft: 6,
    fontWeight: '500',
  },
  details: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
  errorBox: {
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: NEUTRAL,
    fontWeight: 'bold',
    fontSize: 15,
  },
  fallbackText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 16,
    textAlign: 'center',
  },
  matchCard: {
    width: width * 0.44,
    marginBottom: 18,
    backgroundColor: NEUTRAL,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    alignItems: 'center',
    paddingVertical: 22,
    elevation: 2,
    shadowColor: PRIMARY,
    shadowOpacity: 0.10,
    shadowRadius: 6,
    marginRight: 12,
  },
  matchImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF1F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  matchName: {
    color: SECONDARY,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  matchInfo: {
    color: SECONDARY,
    fontSize: 13,
    opacity: 0.8,
  },
  eventsBox: {
    backgroundColor: NEUTRAL,
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  eventsText: {
    color: SECONDARY,
    fontSize: 16,
    fontWeight: '500',
  },
  lockedCard: {
    width: 120,
    height: 130,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  lockedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockedBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    opacity: 0.7,
    zIndex: 1,
  },
  lockedViewAllText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: 15,
    zIndex: 2,
    textAlign: 'center',
  },
  fullViewAllBtn: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 2,
  },
  fullViewAllOutline: {
    borderWidth: 1.5,
    borderColor: '#E67E22',
    backgroundColor: '#FFF6F0',
    borderRadius: 24,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullViewAllText: {
    color: '#E67E22',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  swiperOverlay: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  swiperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  swiperBackBtn: {
    marginRight: 12,
    padding: 4,
  },
  swiperHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: NEUTRAL,
    flex: 1,
  },
  modalGridContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    padding: 8,
  },
  modalSearchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 6,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: PRIMARY,
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileName: {
    color: SECONDARY,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    textAlign: 'center',
  },
  profileInfo: {
    color: SECONDARY,
    fontSize: 13,
    opacity: 0.8,
    textAlign: 'center',
  },
  headerGradient: {
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEE',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: NEUTRAL,
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  membershipRow: {
    flexDirection: 'row',

    alignItems: 'center',
    marginBottom: 2,
  },
  membershipPill: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5CBA7',
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 2,
    height: 36,
    minWidth: 160,
  },
  membershipSegmentActive: {
    backgroundColor: '#FFF6F0',
    borderRightWidth: 1,
    borderRightColor: '#F5CBA7',
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  membershipTextActive: {
    color: '#E67E22',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  membershipSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
    height: '100%',
    backgroundColor: '#fff',
  },
  membershipText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
    marginRight: 8,
  },
  primeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B3B',
    position: 'absolute',
    right: 8,
    top: 10,
  },
  headerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: SECONDARY,
    marginBottom: 2,
  },
  headerCommunityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerCommunity: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: '600',
  },
  headerMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerFreeMember: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
  upgradeBtn: {
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#FFF6F6',
  },
  upgradeBtnText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerIcon: {
    marginLeft: 8,
    padding: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  previewCardDotsRow: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  previewCardDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    opacity: 0.5,
  },
  previewCardDotActive: {
    backgroundColor: '#4AC29A',
    opacity: 1,
  },
});

export default HomeScreen; 
