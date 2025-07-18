import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from './HeaderN'; // ✅ Reused Header with audio

const { width } = Dimensions.get('window');

const dailyRecommendations = [
  { id: '1', name: 'Priya Sharma', age: '27 Yrs', height: `5'2"`, image: require('../assets/profile1.jpg') },
  { id: '2', name: 'Rahul Verma', age: '29 Yrs', height: `5'8"`, image: require('../assets/profile2.jpg') },
  { id: '3', name: 'Anjali Singh', age: '26 Yrs', height: `5'4"`, image: require('../assets/profile3.jpg') },
];

const matchPreferences = [
  { id: '4', name: 'Amit Kumar', age: '28 Yrs', location: 'Delhi', image: require('../assets/profile4.jpg') },
  { id: '5', name: 'Sneha Reddy', age: '25 Yrs', location: 'Pune', image: require('../assets/profile5.jpg') },
  { id: '6', name: 'Karthik Iyer', age: '31 Yrs', location: 'Coimbatore', image: require('../assets/profile6.jpg') },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Header /> {/* ✅ Global header handles speaker/audio */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Recommendations</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {dailyRecommendations.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardInfo}>{item.age}, {item.height}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all &gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Members who match your partner preferences</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {matchPreferences.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardInfo}>{item.age} - {item.location}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventBox}>
          <Text style={styles.eventText}>No events yet!</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  section: { paddingVertical: 25, paddingHorizontal: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  horizontalList: { marginTop: 10 },
  card: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 6 },
  cardName: { fontSize: 13, fontWeight: 'bold' },
  cardInfo: { fontSize: 12, color: '#555' },
  viewAllButton: { alignSelf: 'center', marginTop: 10 },
  viewAllText: { color: '#f48c06', fontWeight: '600' },
  eventBox: {
    backgroundColor: '#f6f6f6',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  eventText: { fontSize: 14, color: '#888' },
});
