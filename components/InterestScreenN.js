import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Header from './HeaderN'; // ✅ Reused Header with music logic

const { width } = Dimensions.get('window');

// Sample interest requests
const incomingRequests = [
  {
    id: '1',
    name: 'Rahul Verma',
    age: 29,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '2',
    name: 'Karthik Iyer',
    age: 31,
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    age: 28,
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

export default function InterestScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}, {item.age}</Text>
        <Text style={styles.message}>sent you an interest 💌</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.acceptBtn}>
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtn}>
            <Text style={styles.btnText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Header /> {/* ✅ Header with mute/unmute icon */}

      {/* 💌 Interest List */}
      <View style={styles.section}>
        <Text style={styles.heading}>Interest Requests</Text>
        <FlatList
          data={incomingRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Interest List
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  declineBtn: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
