import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import axios from 'axios';
import HoroscopeForm from '../components/HoroscopeForm';
import { Buffer } from 'buffer';

export default function HoroscopeScreen({ navigation }) {
  const [step, setStep] = useState('start');
  const [base64Data, setBase64Data] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkIfLoggedIn();
    });
    return unsubscribe;
  }, [navigation]);

  const checkIfLoggedIn = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Session Expired', 'Please log in again');
      navigation.replace('Login');
    }
  };

  const handleSubmit = async (birthPlace, birthTime, imageUrl) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'User not logged in');
      navigation.replace('Login');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        'http://10.0.2.2:3001/user/createHoroscope',
        {
          birthPlace,
          birthTime,
          imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const pdfResponse = await axios.get(
        'http://10.0.2.2:3001/horoscopepdf/generate',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        }
      );

      const base64 = Buffer.from(pdfResponse.data, 'binary').toString('base64');

      // Step 3: Save to device
     const timestamp = Date.now(); // Unique number (milliseconds since 1970)
const fileName = `horoscope_${timestamp}.pdf`;

const filePath =
  Platform.OS === 'android'
    ? `${RNFS.DownloadDirectoryPath}/${fileName}`
    : `${RNFS.DocumentDirectoryPath}/${fileName}`;


      if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Storage permission is required');
          return;
        }
      }

      await RNFS.writeFile(filePath, base64, 'base64');

      setBase64Data(base64);
      setStep('result');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error:', err.message || err);
      Alert.alert('Error', err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'result') setStep('form');
    else if (step === 'form') setStep('start');
  };

  const handleCreate = () => setStep('form');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView contentContainerStyle={styles.container}>
          {step !== 'start' && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}

          {step === 'start' && (
            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
              <Text style={styles.createText}>Create Horoscope</Text>
            </TouchableOpacity>
          )}

          {step === 'form' && (
            <HoroscopeForm onSubmit={handleSubmit} loading={loading} />
          )}

          {step === 'result' && base64Data && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Horoscope Generated Successfully</Text>
              <View style={styles.pdfBox}>
                <Pdf
                  source={{ uri: `data:application/pdf;base64,${base64Data}` }}
                  style={styles.pdf}
                  onError={(error) => {
                    console.error('PDF load error:', error);
                    Alert.alert('Error', 'Could not load PDF');
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {showToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✅ PDF downloaded successfully!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  createBtn: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  createText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  backButton: { marginBottom: 10 },
  backButtonText: { fontSize: 16, color: '#555' },
  resultContainer: { alignItems: 'center', marginTop: 20 },
  resultText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  pdfBox: {
    width: '100%',
    aspectRatio: 0.7,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
