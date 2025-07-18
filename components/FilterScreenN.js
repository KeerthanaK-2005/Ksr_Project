import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from './HeaderN'; // ✅ Reused header with audio toggle

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

const profiles = [
  { id: '1', name: 'Priya Sharma', age: 26, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '2', name: 'Anjali Reddy', age: 25, image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Sneha Kapoor', age: 28, image: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: '4', name: 'Divya Iyer', age: 27, image: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Neha Desai', age: 24, image: 'https://randomuser.me/api/portraits/women/5.jpg' },
];

export default function FilterScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.age}>{item.age} years</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Header /> {/* ✅ Header handles speaker icon and music */}

      <View style={styles.section}>
        <Text style={styles.heading}>Filtered Profiles</Text>
      </View>

      <FlatList
        data={profiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: CARD_WIDTH - 20,
    height: CARD_WIDTH - 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  age: {
    fontSize: 12,
    color: '#666',
  },
});
