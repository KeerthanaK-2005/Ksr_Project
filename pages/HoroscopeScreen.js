import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import HoroscopeForm from '../components/HoroscopeForm';
import HoroscopeResult from '../components/HoroscopeResult';
import { generateDummyHoroscope } from '../assets/horoscopeDummyText';
import { saveTextToFile } from '../assets/fileDownload';

export default function HoroscopeScreen() {
  const [step, setStep] = useState('start');
  const [horoscopeText, setHoroscopeText] = useState('');

  const handleCreate = () => setStep('form');

  const handleSubmit = (birthplace, birthtime) => {
    const time = birthtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = generateDummyHoroscope(birthplace, time);
    setHoroscopeText(text);
    setStep('result');
  };

  const handleDownload = () => {
    saveTextToFile('horoscope.txt', horoscopeText);
  };

  const handleBack = () => {
    if (step === 'result') setStep('form');
    else if (step === 'form') setStep('start');
  };

  return (
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

      {step === 'form' && <HoroscopeForm onSubmit={handleSubmit} />}
      {step === 'result' && (
        <HoroscopeResult text={horoscopeText} onDownload={handleDownload} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  createBtn: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  createText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#555',
  },
});
