 import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HoroscopeScreen = () => {
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleGenerateHoroscope = async () => {
    if (!birthTime || !birthPlace) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token being sent →', token);

      const response = await fetch('http://10.0.2.2:3001/api/user/createHoroscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          birthTime,
          birthPlace,
          imageUrl: 'https://example.com/image.jpg',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        Alert.alert('Success', 'Horoscope generated successfully!');
        navigation.navigate('Result', { result: data }); // ✅ navigate to result screen
      } else {
        Alert.alert('Error', data.message || 'Failed to generate horoscope');
      }

    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userLoggedIn');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('accessToken');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Generate Horoscope</Text>

          {/* Birth Time input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Time (HH:mm:ss)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 10:50:00"
              value={birthTime}
              onChangeText={setBirthTime}
              placeholderTextColor="#000000"
            />
          </View>

          {/* Birth Place input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Place</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chennai"
              value={birthPlace}
              onChangeText={setBirthPlace}
              placeholderTextColor="#000000"
            />
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleGenerateHoroscope}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Generating...' : 'Generate Horoscope'}
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#FF6F61',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    borderWidth: 2,
    borderColor: '#FF6F61',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  button: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HoroscopeScreen;
