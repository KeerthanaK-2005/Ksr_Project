// PaymentScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';

export default function PaymentScreen({ route, navigation }) {
  const { event: rawEvent } = route.params;
  const event = { ...rawEvent, date: new Date(rawEvent.date) };

  const isPaid = event.price !== 'FREE';

  const handlePaymentComplete = () => {
    navigation.replace('EventSuccessScreen', { event: { ...event, date: event.date.toISOString() } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{event.title}</Text>
      <Text style={styles.host}>Hosted by {event.host}</Text>

      {isPaid ? (
        <>
          <Text style={styles.label}>Scan QR to Pay</Text>
          <Image source={require('../assets/images/qr.jpg')} style={styles.qr} />
          <Text style={styles.upi}>UPI ID: wedding@upi</Text>
          <Text style={styles.price}>Amount: {event.price}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title="I Have Paid"
              onPress={handlePaymentComplete}
              color="#28a745"
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.free}>This is a FREE event. You are registered!</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Continue"
              onPress={handlePaymentComplete}
              color="#28a745"
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#d81b60', marginTop: 20 },
  host: { fontSize: 14, color: '#666', marginBottom: 30 },
  label: { fontSize: 16, color: '#333', marginBottom: 10 },
  qr: { width: 200, height: 200, marginBottom: 20 },
  upi: { fontSize: 16, color: '#000' },
  price: { fontSize: 18, color: '#007aff', marginTop: 10, marginBottom: 20 },
  free: { fontSize: 16, color: 'green', marginTop: 50, marginBottom: 30 },
  buttonContainer: { marginTop: 20, width: '80%' },
});
