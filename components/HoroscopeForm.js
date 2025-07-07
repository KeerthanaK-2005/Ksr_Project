import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import TimePickerInput from './TimePickerInput';

export default function HoroscopeForm({ onSubmit }) {
  const [birthplace, setBirthplace] = useState('');
  const [birthtime, setBirthtime] = useState(null);

  const handleSubmit = () => {
    if (!birthplace || !birthtime) {
      Alert.alert('Missing fields', 'Please enter both birthplace and birth time.');
      return;
    }
    onSubmit(birthplace, birthtime);
  };

  return (
    <View>
      <Text style={styles.label}>Birthplace</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter birthplace"
        value={birthplace}
        onChangeText={setBirthplace}
      />

      <Text style={styles.label}>Birthtime</Text>
      <TimePickerInput value={birthtime} onChange={setBirthtime} />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '600', fontSize: 16, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});