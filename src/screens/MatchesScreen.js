import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity, StatusBar, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import profilesData from '../data/profiles';
import ProfileCard from '../components/ProfileCard';
import FilterScreen from './FilterScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MatchesScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredProfiles, setFilteredProfiles] = useState(profilesData);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('right');

  const swipe = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: Animated.event([null, { dx: swipe.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120 || gesture.dx < -120) {
          const isRightSwipe = gesture.dx > 0;
          setSwipeDirection(isRightSwipe ? 'right' : 'left');

          Animated.timing(swipe, {
            toValue: { x: isRightSwipe ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            setCurrentIndex((prev) =>
              isRightSwipe
                ? (prev + 1) % filteredProfiles.length
                : (prev - 1 + filteredProfiles.length) % filteredProfiles.length
            );
            requestAnimationFrame(() => {
              swipe.setValue({ x: 0, y: 0 });
            });
          });
        } else {
          Animated.spring(swipe, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  const clearFilters = () => {
  setFilteredProfiles(profilesData);
  setCurrentIndex(0);
  setIsFilterVisible(true);
};

  const applyFilters = (filters) => {
    const filtered = profilesData.filter((profile) => {
      let isMatch = true;

      if (filters.minAge && profile.age < filters.minAge) isMatch = false;
      if (filters.maxAge && profile.age > filters.maxAge) isMatch = false;
      if (filters.religion && profile.religion !== filters.religion) isMatch = false;
      if (filters.caste && profile.caste !== filters.caste) isMatch = false;
      if (filters.subcaste && profile.subcaste !== filters.subcaste) isMatch = false;
      if (filters.maritalStatus && profile.maritalStatus !== filters.maritalStatus) isMatch = false;
      if (filters.profileCreatedBy && profile.profileCreatedBy !== filters.profileCreatedBy) isMatch = false;
      if (filters.motherTongue && profile.motherTongue !== filters.motherTongue) isMatch = false;
      if (filters.physicalStatus && profile.physicalStatus !== filters.physicalStatus) isMatch = false;
      if (filters.star && profile.star !== filters.star) isMatch = false;
      if (filters.horoscope && profile.horoscope !== filters.horoscope) isMatch = false;
      if (filters.familyType && profile.familyType !== filters.familyType) isMatch = false;
      if (filters.recentActivity && profile.recentActivity !== filters.recentActivity) isMatch = false;
      if (filters.profileType && profile.profileType !== filters.profileType) isMatch = false;
      if (filters.education && profile.education !== filters.education) isMatch = false;
      if (filters.employedIn && profile.employedIn !== filters.employedIn) isMatch = false;
      if (filters.occupation && profile.occupation !== filters.occupation) isMatch = false;
      if (filters.income && profile.income !== filters.income) isMatch = false;
      if (filters.country && profile.country !== filters.country) isMatch = false;
      if (filters.nearbyProfiles && profile.nearbyProfiles !== filters.nearbyProfiles) isMatch = false;
      if (filters.citizenship && profile.citizenship !== filters.citizenship) isMatch = false;
      if (filters.eating && profile.eating !== filters.eating) isMatch = false;
      if (filters.smoking && profile.smoking !== filters.smoking) isMatch = false;
      if (filters.drinking && profile.drinking !== filters.drinking) isMatch = false;

      return isMatch;
    });

    setFilteredProfiles(filtered.length > 0 ? filtered : []);
    setCurrentIndex(0);
    setIsFilterVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Discover</Text>
          <Text style={styles.subheader}>Chicago, IL</Text>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterVisible(true)}>
          <Icon name="sliders" size={20} color="#000" />
        </TouchableOpacity>
      </View>

<View style={styles.cardContainer}>
  {filteredProfiles.length > 0 ? (
    [0, 1].map((i) => {
      const isFront = i === 0;
      const index = isFront
        ? currentIndex
        : swipeDirection === 'right'
          ? (currentIndex + 1) % filteredProfiles.length
          : (currentIndex - 1 + filteredProfiles.length) % filteredProfiles.length;

      if (!filteredProfiles[index]) return null;

      const animatedStyle = isFront
        ? {
            transform: [
              ...swipe.getTranslateTransform(),
              {
                rotate: swipe.x.interpolate({
                  inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                  outputRange: ['-15deg', '0deg', '15deg'],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }
        : {
            transform: [
              {
                scale: swipe.x.interpolate({
                  inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                  outputRange: [1, 0.95, 1],
                  extrapolate: 'clamp',
                }),
              },
              { translateY: 10 },
            ],
          };

      return (
        <Animated.View
        key={`profile-${index}`}
          {...(isFront ? panResponder.panHandlers : {})}
          style={[styles.card, animatedStyle, { zIndex: isFront ? 2 : 1 }]}
        >
          <ProfileCard profile={filteredProfiles[index]} />
        </Animated.View>
      );
    })
  ) : (
    <Text style={{ color: '#333', marginTop: 50 }}>
      No profiles match the filters.
    </Text>
  )}
</View>


      {!isFilterVisible && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navIcon}>
            <Icon name="comment" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon} >
            <Icon name="heart" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon}>
            <Icon name="user" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <FilterScreen
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={applyFilters}
        onClear={clearFilters}  // <-- add this
        isPremiumUser={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#c8daf1' },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: 550,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: 10,
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subheader: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
  },
  navIcon: {
    width: 42,
    height: 42,
    backgroundColor: '#0056D2',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MatchesScreen;