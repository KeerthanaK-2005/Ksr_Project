import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import FiltersModal from './FiltersModal';
import dummyProfiles from '../assets/dummyProfiles';
import ProfileCard from '../components/ProfileCard';
import SwipeHint from '../components/SwipeHint';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const SPACING = 16;
const SIDE_PADDING = (width - CARD_WIDTH) / 2 - 8;

export default function MatchesScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [resetToggle, setResetToggle] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };

  const clearFilters = () => {
    setFilters({});
    setResetToggle((prev) => !prev);
    setFilterVisible(true);
  };

  const filteredProfiles = dummyProfiles.filter((profile) => {
    if (filters.minAge && profile.age < parseInt(filters.minAge)) return false;
    if (filters.maxAge && profile.age > parseInt(filters.maxAge)) return false;
    if (filters.profileCreatedBy && profile.profileCreatedBy !== filters.profileCreatedBy) return false;
    if (filters.maritalStatus && profile.maritalStatus !== filters.maritalStatus) return false;
    if (filters.motherTongue && profile.motherTongue !== filters.motherTongue) return false;
    if (filters.physicalStatus && profile.physicalStatus !== filters.physicalStatus) return false;
    if (filters.religion && profile.religion !== filters.religion) return false;
    if (filters.caste && profile.caste !== filters.caste) return false;
    if (filters.subcaste && profile.subcaste && profile.subcaste !== filters.subcaste) return false;
    if (filters.star && profile.star !== filters.star) return false;
    if (filters.horoscope && profile.horoscope !== filters.horoscope) return false;
    if (filters.dosha && profile.dosha !== filters.dosha) return false;
    if (filters.familyStatus && profile.familyStatus !== filters.familyStatus) return false;
    if (filters.familyValue && profile.familyValue !== filters.familyValue) return false;
    if (filters.familyType && profile.familyType !== filters.familyType) return false;
    if (filters.recentlyActive && profile.recentlyActive !== filters.recentlyActive) return false;
    if (filters.profileType && profile.profileType !== filters.profileType) return false;
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#FFEDE8' }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Matches For You</Text>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
            <Icon name="filter" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.subHeader}>
       <View style={styles.creativeRow}>
  <View style={styles.messageBox}>
    <Icon name="search" size={14} color="#FF6B6B" />
    <Text style={styles.messageText}> Your soulmate could be a swipe away!</Text>
  </View>
</View>
          {Object.keys(filters).length > 0 && (
            <View style={styles.matchCountContainer}>
              <Text style={styles.matchCountText}>
                🔍 {filteredProfiles.length} Match{filteredProfiles.length === 1 ? '' : 'es'} found
              </Text>
            </View>
          )}
        </View>

        <View style={styles.flatListWrapper}>
         {filteredProfiles.length === 0 ? (
  <Text style={{ textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 }}>
    😔 No matches found. Try changing the filters!
  </Text>
) : (
  <FlatList
    data={filteredProfiles}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <ProfileCard profile={item} />}
    horizontal
    pagingEnabled
    snapToInterval={CARD_WIDTH + SPACING}
    snapToAlignment="start"
    decelerationRate="fast"
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      paddingHorizontal: SIDE_PADDING,
    }}
    ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
  />
)}

          <SwipeHint />
        </View>

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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 30,
  },
  subHeader: {
    marginTop: 4,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  taglineText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
    marginBottom: 6,
  },
  matchCountContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderColor: '#FF6B6B',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  matchCountText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 14,
  },
  flatListWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: -40, // Move cards upward
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
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
},

messageText: {
  color: '#FF6B6B',
  fontStyle: 'italic',
  fontWeight: '500',
  fontSize: 13,
},

creativeText: {
  fontSize: 14,
  color: '#FF6B6B',
  fontStyle: 'italic',
  fontWeight: '500',
},

});