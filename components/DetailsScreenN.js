import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = width * 0.55;

export default function DetailsScreen({ navigation }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

  const invitations = [
    { id: '1', title: 'Vintage Garden Wedding', price: '₹1800', date: weekAgo, time: '4:00 PM', location: 'Namakkal', type: 'Paid', image: require('../assets/event1.jpg'), dressCode: 'Floral or Pastel', highlights: ['Live violin performance', 'Buffet', 'Photo booth', 'Lanterns', 'Dance floor'] },
    { id: '2', title: 'Beachside Vows Cafe', price: 'FREE', date: twoDaysAgo, time: '5:30 PM', location: 'Thrichy', type: 'Free', image: require('../assets/event1.jpg'), dressCode: 'White & Beige', highlights: ['Sunset vows', 'Seafood', 'Fire show', 'Bonfire', 'Drone footage'] },
    { id: '3', title: 'Today: Royal Banquet', price: '₹3000', date: today, time: '6:00 PM', location: 'Chennai', type: 'Invite', image: require('../assets/event1.jpg'), dressCode: 'Traditional', highlights: ['Live band', 'Gold decor', '7-course meal', 'Elephants', 'Cultural show'] },
    { id: '4', title: 'Sunset Terrace Ceremony', price: 'FREE', date: tomorrow, time: '7:00 PM', location: 'Coimbatore', type: 'Free', image: require('../assets/event1.jpg'), dressCode: 'Cocktail Attire', highlights: ['Rooftop vows', 'Champagne', 'City view', 'Live duo', 'Candles'] },
    { id: '5', title: 'Mehendi Fiesta Vibe', price: '₹1000', date: nextWeek, time: '3:00 PM', location: 'Madurai', type: 'Paid', image: require('../assets/event1.jpg'), dressCode: 'Colorful Ethnic', highlights: ['Henna', 'Dhol', 'Folk singers', 'Rangoli', 'Snacks'] },
  ];

  const filters = ['All', 'Upcoming', 'Past', 'Free', 'Paid', 'Invite'];
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');

  const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);

  const countEvents = (type) =>
    invitations.filter((inv) => {
      const d = new Date(inv.date);
      if (type === 'All') return true;
      if (type === 'Upcoming') return d > todayDate;
      if (type === 'Past') return d < todayDate;
      if (type === 'Free') return inv.price === 'FREE';
      if (type === 'Paid') return inv.price !== 'FREE';
      if (type === 'Invite') return inv.type === 'Invite';
    }).length;

  const filterEvents = (inv) => {
    const d = new Date(inv.date);
    if (selectedFilter === 'Upcoming') return d > todayDate;
    if (selectedFilter === 'Past') return d < todayDate;
    if (selectedFilter === 'Free') return inv.price === 'FREE';
    if (selectedFilter === 'Paid') return inv.price !== 'FREE';
    if (selectedFilter === 'Invite') return inv.type === 'Invite';
    return true;
  };

  const filtered = invitations
    .filter(filterEvents)
    .filter((ev) => {
      const search = searchText.toLowerCase();
      const dateStr = `${ev.date.getDate().toString().padStart(2, '0')}/${(ev.date.getMonth() + 1).toString().padStart(2, '0')}/${ev.date.getFullYear()}`;
      return (
        ev.title.toLowerCase().includes(search) ||
        ev.location.toLowerCase().includes(search) ||
        ev.price.toLowerCase().includes(search) ||
        ev.time.toLowerCase().includes(search) ||
        dateStr.includes(search)
      );
    });

  const renderCard = ({ item, index }) => (
    <View style={[styles.cardWrapper, { marginLeft: index === 0 ? CARD_GAP : 0 }]}>
      <ImageBackground source={item.image} style={styles.card} imageStyle={styles.cardBg}>
        <View style={styles.overlay}>
          <View style={styles.cardTop}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>

          <View style={styles.centerButtons}>
            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Payment', { event: item })}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              console.log('Selected Event:', item.title); // Debug log
              setSelectedEvent(item);
            }}>
              <Text style={styles.viewText}>View Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.venueLabel}>Venue :</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{item.date.getDate().toString().padStart(2, '0')}/{(item.date.getMonth() + 1).toString().padStart(2, '0')}/{item.date.getFullYear()}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>⏰</Text>
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.searchHeader}>
          <Text style={styles.heading}>Wedding Invitation</Text>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search title, location, price, time or date..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map(label => (
              <TouchableOpacity key={label} onPress={() => setSelectedFilter(label)} style={[styles.filterButton, selectedFilter === label && styles.activeFilter]}>
                <Text style={[styles.filterText, selectedFilter === label && styles.activeFilterText]}>
                  {label} <Text style={[styles.filterCount, selectedFilter === label && styles.activeFilterCount]}>{countEvents(label)}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Event List */}
        <FlatList
          data={filtered}
          renderItem={renderCard}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: CARD_GAP, paddingBottom: 30 }}
          ListEmptyComponent={<Text style={styles.empty}>No events found.</Text>}
        />

        {/* MODAL */}
        <Modal visible={!!selectedEvent} animationType="fade" transparent onRequestClose={() => setSelectedEvent(null)}>
          <TouchableWithoutFeedback onPress={() => setSelectedEvent(null)}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  {selectedEvent && (
                    <>
                      <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                      <Text style={styles.modalSub}>Dress Code: {selectedEvent.dressCode}</Text>
                      <Text style={styles.modalSub}>Highlights:</Text>
                      {selectedEvent.highlights.map((line, i) => (
                        <Text key={i} style={styles.modalText}>• {line}</Text>
                      ))}
                      <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.closeBtn}>
                        <Text style={styles.closeText}>Close</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D63384',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderColor: '#f7c6c8',
    borderWidth: 1,
    width: '55%',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterButton: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#D63384',
  },
  filterText: {
    fontSize: 12,
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterCount: {
    fontWeight: 'bold',
    color: '#D63384',
  },
  activeFilterCount: {
    color: '#fff',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
  },
  card: {
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  cardBg: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'flex-start',
    padding: 10,
    position: 'relative',
  },
  cardTop: {
    alignItems: 'center',
    paddingTop: 45,
  },
  title: {
    color: '#D63384',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  price: {
    color: '#000',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },
  centerButtons: {
    position: 'absolute',
    top: '37%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#D63384',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginVertical: 6,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  viewText: {
    color: '#D63384',
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  metaBlock: {
    position: 'absolute',
    bottom: 18,
    right: 30,
    alignItems: 'flex-start',
    padding: 6,
    borderRadius: 8,
    //backgroundColor: 'rgba(255,255,255,0.85)',
    maxWidth: '70%',
  },
  venueLabel: {
    fontSize: 10,
    color: '#D63384',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  metaIcon: {
    fontSize: 10,
    color: '#D63384',
    fontWeight: 'bold',
    marginRight: 4,
    width: 16,
    textAlign: 'center',
  },
  metaText: {
    fontSize: 10,
    color: '#000',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 12,
  },

  // MODAL STYLES
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    width: '85%',
    maxHeight: '70%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D63384',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSub: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    color: '#333',
  },
  modalText: {
    fontSize: 12,
    marginBottom: 4,
    color: '#333',
  },
  closeBtn: {
    backgroundColor: '#D63384',
    paddingVertical: 8,
    marginTop: 16,
    borderRadius: 22,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
