 import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BirthDetailsForm() {
  const navigation = useNavigation();

  const [birthPlace, setBirthPlace] = useState('');
  const [birthTime, setBirthTime] = useState('');

  const handleSubmit = () => {
    if (!birthPlace || !birthTime) {
      alert('Please fill all fields');
      return;
    }

    // You can store or send data to backend here

    // Navigate to Horoscope Screen
    navigation.navigate('Horoscope', {
      birthPlace,
      birthTime,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>Birth Place</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your birth place"
            value={birthPlace}
            onChangeText={setBirthPlace}
          />

          <Text style={styles.label}>Birth Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your birth time (e.g., 10:30 AM)"
            value={birthTime}
            onChangeText={setBirthTime}
          />

          <View style={styles.button}>
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  button: {
    marginTop: 30,
  },
});
