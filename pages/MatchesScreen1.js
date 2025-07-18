import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FiltersModal from '../components/FiltersModal1';
import ProfileCard from '../assets/ProfileCard';
import SwipeHint from '../assets/SwipeHint';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const SPACING = 16;
const SIDE_PADDING = (width - CARD_WIDTH) / 2 - 8;

export default function MatchesScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [resetToggle, setResetToggle] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef(null);
  const scrollIndex = useRef(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    fetchAllProfiles(); 
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchAllProfiles = async () => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.warn('Access token missing');
      return;
    }

    const emptyFilters = {}; 

    const response = await fetch(
      'http://10.0.2.2:3001/middleware/subscriptionAccess/searchFilters',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emptyFilters),
      }
    );

    const data = await response.json();

    if (response.ok && data.filteredPreferences) {
      const mappedProfiles = data.filteredPreferences.map((p) => ({
        id: p.userId,
        name: p.firstName + (p.lastName ? ' ' + p.lastName : ''),
        age: p.age,
        location: `${p.city}, ${p.state}`,
        images: [],
        aiMatch: Math.floor(Math.random() * 20) + 80,
        vibeTags: [
          { label: 'Kind', icon: 'heart' },
          { label: 'Fun', icon: 'smile' },
          { label: 'Loyal', icon: 'user' },
        ],
        premium: true,
        verified: true,
      }));

      setProfiles(mappedProfiles);
    } else {
      console.warn('No profiles returned:', data.error || 'No matches found');
    }
  } catch (error) {
    console.error('Error fetching all profiles:', error);
  } finally {
    setLoading(false);
  }
};

  const applyFilters = async (newFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.warn('No access token found');
        return;
      }

      const mappedFilters = {
        ageMin: newFilters.minAge,
        ageMax: newFilters.maxAge,
        heightmin: newFilters.minHeight,
        heightmax: newFilters.maxHeight,
        education: newFilters.education,
        occupation: newFilters.occupation,
        state: newFilters.state,
        city: newFilters.city,
        religion: newFilters.religion,
        caste: newFilters.caste,
        lifestyle: newFilters.lifestyle,
        maritalStatus: newFilters.maritalStatus,
        motherTongue: newFilters.motherTongue,
        subCaste: newFilters.subcaste,
        starSign: newFilters.star,
        dietPreferences: newFilters.eating,
        smokingHabits: newFilters.smoking,
        drinkingHabits: newFilters.drinking,
        country: newFilters.country,
        annualIncome: newFilters.income,
        employedIn: newFilters.employmentType,
        college: newFilters.institution,
        recentlyActiveDays:
          newFilters.recentlyActive === 'Last 24h'
            ? 1
            : newFilters.recentlyActive === 'Last Week'
            ? 7
            : undefined,
      };

      const response = await fetch(
        'http://10.0.2.2:3001/middleware/subscriptionAccess/searchFilters',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedFilters),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const mappedProfiles = data.filteredPreferences.map((p) => ({
          id: p.userId,
          name: p.firstName + (p.lastName ? ' ' + p.lastName : ''),
          age: p.age,
          location: `${p.city}`,
          images: [], // Replace with real images if available
          aiMatch: Math.floor(Math.random() * 20) + 80, // Optional mock
          vibeTags: [
            { label: 'Kind', icon: 'heart' },
            { label: 'Fun', icon: 'smile' },
            { label: 'Loyal', icon: 'user' },
          ],
          premium: true,
          verified: true,
        }));

        setProfiles(mappedProfiles);
        scrollIndex.current = 0;
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index: 0, animated: false });
        }, 100);
      } else {
        console.warn('Filter API error:', data?.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setResetToggle((prev) => !prev);
    setFilterVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff3f0' }}>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.headerRow, { opacity: fadeAnim }]}>
          <Text style={styles.pageTitle}>Matches For You</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.7}
          >
            <Icon name="filter" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.subHeader}>
          <View style={styles.creativeRow}>
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>Find your soulmate effortlessly</Text>
            </View>
          </View>

          {Object.keys(filters).length > 0 && (
            <View style={styles.matchCountContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="zap" size={14} color="#FF6B6B" style={{ marginRight: 6 }} />
                <Text style={styles.matchCountText}>
                  {profiles.length} Match{profiles.length === 1 ? '' : 'es'} Found
                </Text>
              </View>
            </View>
          )}
        </View>

<View style={styles.flatListWrapper}>
  {profiles.length === 0 && !loading && (
    <Text style={styles.noMatchText}>😔 No matches found. Try adjusting filters!</Text>
  )}
  <FlatList
    ref={flatListRef}
    onMomentumScrollEnd={(event) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
      scrollIndex.current = index;
      setVisibleIndex(index);
    }}
    data={profiles}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <AnimatedProfileCard profile={item} />}
    horizontal
    pagingEnabled
    snapToInterval={CARD_WIDTH + SPACING}
    snapToAlignment="start"
    decelerationRate="fast"
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
    ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
  />
</View>

{loading && (
  <Text style={styles.noMatchText}>Loading...</Text> // or use <ActivityIndicator />
)}


        <FiltersModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={applyFilters}
          onClear={clearFilters}
          isPremium={true}
          resetToggle={resetToggle}
        />
      </SafeAreaView>
    </View>
  );
}

const AnimatedProfileCard = ({ profile }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.animatedCard, { opacity, transform: [{ scale }] }]}>
      <ProfileCard profile={profile} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  filterButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  subHeader: {
    marginTop: 6,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  matchCountContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderColor: '#FF6B6B',
    borderWidth: 1,
    marginTop: 8,
  },
  matchCountText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
  },
  flatListWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  creativeRow: {
    marginTop: 6,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  messageText: {
    color: '#FF6B6B',
    fontStyle: 'italic',
    fontWeight: '500',
    fontSize: 13,
  },
  noMatchText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
  },
  animatedCard: {
    transform: [{ scale: 1 }],
  },
});
