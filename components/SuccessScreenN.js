// SuccessScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SuccessScreen({ route }) {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <Image source={require('../assets/success.png')} style={styles.image} />
      <Text style={styles.title}>Registration Successful!</Text>
      <Text style={styles.subtitle}>You are registered for:</Text>
      <Text style={styles.eventName}>{event.title}</Text>
      <Text style={styles.host}>Hosted by {event.host}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20,
  },
  image: {
    width: 150, height: 150, marginBottom: 30,
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#28a745', marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, color: '#444',
  },
  eventName: {
    fontSize: 18, fontWeight: 'bold', color: '#d81b60', marginTop: 10,
  },
  host: {
    fontSize: 14, color: '#555', marginTop: 4,
  },
});
