import React, { useState, useEffect, useRef, useReducer, memo, Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, Dimensions, Modal, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const PRIMARY = '#FF6B6B';
const SECONDARY = '#000000';
const NEUTRAL = '#FFFFFF';
const { width } = Dimensions.get('window');

// Card size constants
const CARD_RADIUS = 20;
const CARD_HEIGHT = 220;
const CARD_WIDTH = 150;

const allDailyRecommendations = [
  { id: 1, name: 'Priya Sharma', age: 27, height: `5'2"`, matrimonyId: 'M0000001', location: 'Chennai', photo: 'https://randomuser.me/api/portraits/women/44.jpg', photos: ['https://randomuser.me/api/portraits/women/44.jpg', 'https://randomuser.me/api/portraits/women/45.jpg', 'https://randomuser.me/api/portraits/women/46.jpg'] },
  { id: 2, name: 'Rahul Verma', age: 29, height: `5'8"`, matrimonyId: 'M0000002', location: 'Bangalore', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Anjali Singh', age: 26, height: `5'4"`, matrimonyId: 'M0000003', location: 'Hyderabad', photo: 'https://randomuser.me/api/portraits/women/67.jpg', photos: ['https://randomuser.me/api/portraits/women/67.jpg', 'https://randomuser.me/api/portraits/women/68.jpg'] },
  { id: 4, name: 'Vikram Patel', age: 30, height: `5'10"`, matrimonyId: 'M0000004', location: 'Mumbai', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 5, name: 'Sujitha P', age: 20, height: `5'2"`, matrimonyId: 'M0000005', location: 'Thevaram, Tamil Nadu', photo: 'https://your-image-url.com/sujitha.jpg' },
  { id: 6, name: 'Amit Kumar', age: 28, height: `5'7"`, matrimonyId: 'M0000006', location: 'Delhi', photo: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { id: 7, name: 'Sneha Reddy', age: 25, height: `5'3"`, matrimonyId: 'M0000007', location: 'Pune', photo: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 8, name: 'Karthik Iyer', age: 31, height: `5'9"`, matrimonyId: 'M0000008', location: 'Coimbatore', photo: 'https://randomuser.me/api/portraits/men/47.jpg' },
  { id: 9, name: 'Meera Joshi', age: 27, height: `5'6"`, matrimonyId: 'M0000009', location: 'Kolkata', photo: 'https://randomuser.me/api/portraits/women/69.jpg' },
  { id: 10, name: 'Rohan Das', age: 29, height: `5'9"`, matrimonyId: 'M0000010', location: 'Jaipur', photo: 'https://randomuser.me/api/portraits/men/48.jpg' },
  { id: 11, name: 'Divya Nair', age: 26, height: `5'3"`, matrimonyId: 'M0000011', location: 'Trivandrum', photo: 'https://randomuser.me/api/portraits/women/70.jpg' },
  { id: 12, name: 'Arjun Rao', age: 32, height: `5'11"`, matrimonyId: 'M0000012', location: 'Mysore', photo: 'https://randomuser.me/api/portraits/men/49.jpg' },
  { id: 13, name: 'Lakshmi Menon', age: 24, height: `5'5"`, matrimonyId: 'M0000013', location: 'Kochi', photo: 'https://randomuser.me/api/portraits/women/71.jpg' },
  { id: 14, name: 'Sandeep Singh', age: 28, height: `5'8"`, matrimonyId: 'M0000014', location: 'Amritsar', photo: 'https://randomuser.me/api/portraits/men/50.jpg' },
  { id: 15, name: 'Pooja R', age: 25, height: `5'4"`, matrimonyId: 'M0000015', location: 'Madurai', photo: 'https://randomuser.me/api/portraits/women/72.jpg' },
  { id: 16, name: 'Vivek Anand', age: 29, height: `5'10"`, matrimonyId: 'M0000016', location: 'Chennai', photo: 'https://randomuser.me/api/portraits/men/51.jpg' },
];

// Fix addProfileExtras: use profile.photos if present, else [profile.photo]
const addProfileExtras = (profile, idx) => ({
  ...profile,
  photos: profile.photos ? profile.photos : [profile.photo],
  isOnline: idx % 2 === 0,
  lastSeen: idx % 2 === 0 ? null : `${10 + idx} mins ago`,
  isVerified: idx % 3 === 0,
  isPremium: idx % 4 === 0,
  matchScore: 80 + (idx % 20),
});
const allProfilesWithExtras = allDailyRecommendations.map(addProfileExtras);

// ProfileCard for modal (fix: only eye icon opens profile)
const ProfileCard = memo(({ profile, onViewProfile }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setPhotoIndex(viewableItems[0].index || 0);
    }
  });
  return (
    <View style={styles.profileCardModern}>
      {/* Left: Photo(s) + online status */}
      <View style={styles.profileCardPhotoCol}>
        <View style={styles.profileCardPhotoWrap}>
          {profile.photos.length > 1 ? (
            <FlatList
              data={profile.photos}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.profileCardPhoto} />
              )}
              style={{ height: '100%' }}
              contentContainerStyle={{ height: '100%' }}
              pagingEnabled
              initialScrollIndex={0}
              getItemLayout={(_, index) => ({ length: 160, offset: 160 * index, index })}
              viewabilityConfig={viewabilityConfig}
              onViewableItemsChanged={onViewableItemsChanged.current}
              removeClippedSubviews={false}
              windowSize={2}
              initialNumToRender={5}
            />
          ) : (
            <Image source={{ uri: profile.photos[0] }} style={styles.profileCardPhoto} />
          )}
          {/* Online status dot */}
          <View style={[styles.onlineDot, { backgroundColor: profile.isOnline ? '#1DBF73' : '#bbb' }]} />
          {profile.photos.length > 1 && (
            <View style={styles.profileCardPhotoDotsRow}>
              {profile.photos.map((_, idx) => (
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

// Add back the PreviewCard component for the preview row:
const PreviewCard = ({ profile, onBodyPress, setOuterScrollEnabled }) => {
  // Hard runtime guard and diagnostic log
  const safeProfile = { ...profile };
  const fields = ['name', 'matrimonyId', 'age', 'location'];
  fields.forEach(field => {
    if (typeof safeProfile[field] !== 'string' && typeof safeProfile[field] !== 'number') {
      safeProfile[field] = '';
    } else {
      safeProfile[field] = String(safeProfile[field]);
    }
  });
  if (!Array.isArray(safeProfile.photos)) {
    safeProfile.photos = [];
  } else {
    safeProfile.photos = safeProfile.photos.filter(p => typeof p === 'string');
  }
  if (typeof safeProfile.photo !== 'string') {
    safeProfile.photo = '';
  }

  // Move logging to useEffect to avoid infinite console spam
  React.useEffect(() => {
    console.log('PreviewCard props:', safeProfile);
    console.log('PreviewCard render values:', {
      name: safeProfile.name,
      matrimonyId: safeProfile.matrimonyId,
      age: safeProfile.age,
      location: safeProfile.location,
      images: safeProfile.photos && safeProfile.photos.length > 0 ? safeProfile.photos : [safeProfile.photo],
      hasMultipleImages: (safeProfile.photos && safeProfile.photos.length > 1),
      profile,
      safeProfile,
    });
  }, [safeProfile.name, safeProfile.matrimonyId, safeProfile.age, safeProfile.location, JSON.stringify(safeProfile.photos), safeProfile.photo]);

  const [photoIndex, setPhotoIndex] = useState(0);
  const scrollViewRef = useRef(null);
  
  // Handle scroll to update current photo index
  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const imageWidth = CARD_WIDTH;
    const newIndex = Math.round(contentOffset / imageWidth);
    setPhotoIndex(newIndex);
  };

  // Get images array - use photos if available, otherwise [photo]
  const images = safeProfile.photos && safeProfile.photos.length > 0 ? safeProfile.photos : [safeProfile.photo];
  const hasMultipleImages = images.length > 1;

  // Touch handlers to control outer FlatList scroll
  const handleTouchStart = () => setOuterScrollEnabled && setOuterScrollEnabled(false);
  const handleTouchEnd = () => setOuterScrollEnabled && setOuterScrollEnabled(true);

  const isValidChild = (child) => {
    return (
      child === null ||
      child === undefined ||
      typeof child === 'boolean' ||
      React.isValidElement(child)
    );
  };

  const filterChildren = (children) => {
    if (Array.isArray(children)) {
      return children.filter(isValidChild);
    }
    return isValidChild(children) ? children : null;
  };

  try {
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
              {filterChildren(images.map((image, index) => {
                if (!image) return null;
                return (
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
                );
              }))}
            </ScrollView>
          ) : (
            images[0] ? (
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
            ) : null
          )}
          {/* Indicator dots for multiple images */}
          {hasMultipleImages && (
            <View style={styles.previewCardDotsRow}>
              {filterChildren(images.map((_, idx) => {
                const dot = (
                  <View 
                    key={idx} 
                    style={[
                      styles.previewCardDot, 
                      photoIndex === idx && styles.previewCardDotActive
                    ]} 
                  />
                );
                if (!isValidChild(dot)) {
                  return null;
                }
                return dot;
              }))}
            </View>
          )}
        </View>
        {/* Card body: only this is touchable for navigation */}
        <TouchableOpacity style={styles.cardContent} activeOpacity={0.85} onPress={onBodyPress}>
          <Text style={styles.name}>{safeProfile.name}</Text>
          {safeProfile.matrimonyId ? <Text style={styles.matrimonyId}>{safeProfile.matrimonyId}</Text> : null}
          <Text style={styles.details}>{safeProfile.age ? `${safeProfile.age} yrs` : ''}</Text>
          <Text style={styles.details}>{safeProfile.location}</Text>
        </TouchableOpacity>
      </View>
    );
  } catch (err) {
    // Only log error once per error occurrence
    React.useEffect(() => {
      console.error('PreviewCard render error:', err, {
        name: safeProfile.name,
        matrimonyId: safeProfile.matrimonyId,
        age: safeProfile.age,
        location: safeProfile.location,
        images,
        hasMultipleImages,
        profile,
        safeProfile,
      });
    }, [err]);
    throw err;
  }
};

// ErrorBoundary for PreviewCard
class PreviewCardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('PreviewCard ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 16, backgroundColor: '#fff0f0', borderRadius: 8 }}>
          <Text style={{ color: '#FF6B6B', fontWeight: 'bold' }}>PreviewCard Error:</Text>
          <Text selectable style={{ color: '#333', marginTop: 8 }}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Wrap PreviewCard export with ErrorBoundary
const WrappedPreviewCard = (props) => (
  <PreviewCardErrorBoundary>
    <PreviewCard {...props} />
  </PreviewCardErrorBoundary>
);

const DailyRecommendation = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalFilteredProfiles, setModalFilteredProfiles] = useState(allDailyRecommendations);
  // Timer state
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // seconds left in 24 hours
  // Control outer FlatList scroll
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);

  // Countdown effect
  useEffect(() => {
    // Calculate seconds left until next midnight
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const secondsLeft = Math.floor((nextMidnight - now) / 1000);
    setTimeLeft(secondsLeft);

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Reset to 24 hours at midnight
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format timeLeft as HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    if (!modalSearch.trim()) {
      setModalFilteredProfiles(allDailyRecommendations);
    } else {
      const lower = modalSearch.toLowerCase().replace(/\s+/g, '');
      setModalFilteredProfiles(
        allDailyRecommendations.filter(
          p =>
            p.name.toLowerCase().replace(/\s+/g, '').includes(lower) ||
            p.matrimonyId.toLowerCase().replace(/\s+/g, '').includes(lower) ||
            p.location.toLowerCase().replace(/\s+/g, '').includes(lower)
        )
      );
    }
  }, [modalSearch]);

  // Preview section (3 cards + blurred card)
  const previewProfiles = allProfilesWithExtras.slice(0, 4); // Get first 4 with extras
  const hasProfiles = allDailyRecommendations.length > 0;
  return (
    <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
      {/* Header */}
      <View style={styles.rowHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Daily Recommendations</Text>
          <Text style={styles.sectionSubtitle}>Recommended matches for today</Text>
        </View>
        <View style={styles.timerBadge}>
          <View style={styles.timerBadgeTrapezium}>
            <View style={styles.timerBadgeSlant} />
            <LinearGradient colors={['#FF7F7F', '#FFB6B9']} start={{x:0, y:0}} end={{x:1, y:1}} style={{ ...StyleSheet.absoluteFillObject, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
              <View style={styles.timerBadgeInner}>
                <Text style={styles.timerBadgeText}>Time left to view</Text>
                <Text style={styles.timerBadgeTime}>{formatTime(timeLeft)}</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
      {/* Preview cards - use FlatList instead of ScrollView */}
      <FlatList
        data={previewProfiles}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `preview-${item.id}`}
        renderItem={({ item, index }) => {
          let element;
          if (index === 3) {
            element = (
              <TouchableOpacity key={item.id} style={[styles.recommendCard, { width: CARD_WIDTH }]} activeOpacity={0.85} onPress={() => setShowModal(true)}>
                <View style={{ position: 'relative', width: CARD_WIDTH, alignItems: 'center', height: CARD_HEIGHT * 0.56 }}>
                  <Image source={{ uri: item.photo }} style={[
                    styles.cardImage,
                    {
                      width: CARD_WIDTH,
                      height: CARD_HEIGHT * 0.56,
                      borderTopLeftRadius: CARD_RADIUS,
                      borderTopRightRadius: CARD_RADIUS,
                      borderBottomLeftRadius: CARD_RADIUS,
                      borderBottomRightRadius: 0,
                    },
                  ]} blurRadius={8} />
                  <View style={styles.blurOverlay} />
                  <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={styles.lockedViewAllTextCard}>View all</Text>
                    <Icon name="chevron-forward" size={16} color="#E67E22" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          } else {
            element = (
              <WrappedPreviewCard
                key={item.id}
                profile={{
                  ...item,
                  name: item.name ? String(item.name) : '',
                  matrimonyId: item.matrimonyId ? String(item.matrimonyId) : '',
                  age: item.age ? String(item.age) : '',
                  location: item.location ? String(item.location) : '',
                }}
                onBodyPress={() => navigation.navigate('ViewProfile', { matrimonyId: item.matrimonyId })}
                setOuterScrollEnabled={setOuterScrollEnabled}
              />
            );
          }
          // Log the type and value of the element returned
          if (!React.isValidElement(element)) {
            console.error('FlatList renderItem did not return a valid React element:', element, typeof element, element && element.constructor && element.constructor.name);
            return null;
          }
          return element;
        }}
        style={{ marginTop: 8 }}
        contentContainerStyle={{ alignItems: 'center' }}
        scrollEnabled={outerScrollEnabled}
      />
      {/* Full-width View all button */}
      <TouchableOpacity style={styles.fullViewAllBtn} activeOpacity={0.85} onPress={() => setShowModal(true)}>
        <View style={styles.fullViewAllOutline}>
          <Text style={styles.fullViewAllText}>View all {'>'}</Text>
        </View>
      </TouchableOpacity>
      {/* Modal/Page for all recommendations */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <LinearGradient colors={["#FFFFFF", "#FF6B6B"]} style={styles.swiperOverlay}>
          {/* Header */}
          <View style={styles.swiperHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.swiperBackBtn}>
              <Icon name="arrow-back" size={24} color="#FF6B6B" />
            </TouchableOpacity>
            <Text style={styles.swiperHeaderTitle}>Daily Recommendations</Text>
          </View>
          {/* Grid and search bar */}
          <View style={styles.modalGridContainer}>
            <View style={styles.modalSearchBarWrap}>
              <Icon name="search" size={22} color={PRIMARY} style={{ marginRight: 6 }} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search by name, matrimony ID, or location"
                value={modalSearch}
                onChangeText={setModalSearch}
                placeholderTextColor="#888"
              />
            </View>
            <FlatList
              key="modern"
              data={modalFilteredProfiles.slice(0, 16).map(addProfileExtras)}
              renderItem={({ item }) => (
                <ProfileCard
                  profile={{
                    ...item,
                    name: item.name ? String(item.name) : '',
                    matrimonyId: item.matrimonyId ? String(item.matrimonyId) : '',
                    age: item.age ? String(item.age) : '',
                    location: item.location ? String(item.location) : '',
                  }}
                  onViewProfile={() => navigation.navigate('ViewProfile', { matrimonyId: item.matrimonyId })}
                />
              )}
              numColumns={1}
              contentContainerStyle={{ paddingBottom: 16 }}
              scrollEnabled={true}
              ListEmptyComponent={<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 }}><Text style={{ color: '#888', fontSize: 18, textAlign: 'center' }}>Searched Profile is not found</Text></View>}
            />
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderRightColor: '#FF7F7F',
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    zIndex: 2,
  },
  timerBadgeInner: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
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
    height: '56%', // increased from 50%
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
  lockedCard: {
    width: 120,
    height: 130,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#F7F7FA', // match preview card color
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  lockedImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lockedBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    opacity: 0.7,
    borderRadius: 12,
  },
  lockedViewAllText: {
    color: PRIMARY,
    fontWeight: 'bold',
    fontSize: 15,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  fullViewAllBtn: {
    marginTop: 10,
    marginBottom: 2,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  fullViewAllOutline: { borderWidth: 1.5, borderColor: '#E67E22', backgroundColor: '#FFF6F0', borderRadius: 24, paddingVertical: 7, alignItems: 'center', justifyContent: 'center' },
  fullViewAllText: { color: '#E67E22', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.2 },
  swiperOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    zIndex: 100,
  },
  swiperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  swiperBackBtn: {
    padding: 8,
  },
  swiperHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    flex: 1,
  },
  modalGridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flex: 1,
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    color: SECONDARY,
    paddingVertical: 4,
    paddingLeft: 8,
    backgroundColor: 'transparent',
  },
  profileCard: {
    margin: 8,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  profileRow: {
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: SECONDARY,
    textAlign: 'center',
    marginBottom: 2,
  },
  profileInfo: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 1,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    opacity: 0.25,
    borderRadius: 12,
  },
  lockedViewAllTextCard: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#E67E22',
    fontWeight: 'bold',
    fontSize: 15,
    zIndex: 2,
  },
  profileCardFull: {
    width: '96%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: 'hidden',
  },
  profileCardFullCompact: {
    width: '96%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    overflow: 'hidden',
    minHeight: 350, // increased height
    maxHeight: 400,
    paddingBottom: 10,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1.7,
    position: 'relative',
    backgroundColor: '#EEE',
  },
  imageWrapperCompact: {
    width: '100%',
    aspectRatio: 2.2, // shorter image
    position: 'relative',
    backgroundColor: '#EEE',
  },
  profileImageFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImageFullCompact: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeVerified: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: '#1DBF73',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgePremium: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileDetailsFull: {
    padding: 14,
    alignItems: 'flex-start',
  },
  nameFull: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  metaFull: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  detailFull: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  buttonRowFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 6,
  },
  btnSecondaryFull: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 6,
  },
  btnOutlineFull: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 6,
  },
  btnPrimaryFull: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  btnTextFull: {
    color: '#333',
    fontWeight: 'bold',
  },
  btnTextOutlineFull: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  btnTextPrimaryFull: {
    color: '#fff',
    fontWeight: 'bold',
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
  profileCardOnlineText: {
    fontSize: 10,
    color: '#1DBF73',
    marginBottom: 2,
  },
  profileCardLastSeen: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  profileCardBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // reduced gap
    gap: 8,
    marginTop: 2, // add small top margin
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
    justifyContent: 'center', // center horizontally
    marginTop: 6, // reduced vertical gap
    gap: 18, // more even spacing
  },
  profileCardActionBtn: {
    backgroundColor: '#F7F7FA',
    borderRadius: 20,
    padding: 8,
    marginRight: 0,
    elevation: 1,
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
  // Add new style for status container
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

export default DailyRecommendation; 