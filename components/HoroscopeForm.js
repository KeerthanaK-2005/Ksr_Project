import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import TimePickerInput from '../assets/TimePickerInput';

// ✅ Helper to format Date object to "HH:mm:ss"
const formatToHHMMSS = date => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = '00';
  return `${hours}:${minutes}:${seconds}`;
};

export default function HoroscopeForm({ onSubmit, loading }) {
  const [birthPlace, setBirthPlace] = useState('');
  const [birthTime, setBirthTime] = useState(null); // Date object
  const [imageUrl, setImageUrl] = useState('');


  const handleFormSubmit = () => {
    if (!birthPlace || !birthTime) {
      Alert.alert('Missing data', 'Please fill all fields');
      return;
    }

    const formattedTime = formatToHHMMSS(birthTime); // ✅ Convert to "HH:mm:ss"
    onSubmit(birthPlace, formattedTime, imageUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Birth Place</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter place of birth"
        value={birthPlace}
        onChangeText={setBirthPlace}
      />

      <Text style={styles.label}>Birth Time</Text>
      <TimePickerInput value={birthTime} onChange={setBirthTime} />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />


     <TouchableOpacity
  style={[styles.submitBtn, loading && styles.disabledBtn]}
  onPress={handleFormSubmit}
  disabled={loading}
>
  <Text style={styles.submitText}>
    {loading ? 'Generating...' : 'Generate Horoscope'}
  </Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: '#FF6B6B',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledBtn: {
  opacity: 0.6,
},
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
