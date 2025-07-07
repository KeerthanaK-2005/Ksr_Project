/*
File: src/components/Horoscope/HoroscopeResult.js
Update to display full API response in text format
*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function HoroscopeResult({ text, onDownload }) {
  return (
    <View>
      <Text style={styles.title}>Horoscope Result</Text>

      <ScrollView style={styles.textContainer}>
        <Text selectable style={styles.text}>{text}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={onDownload}>
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  textContainer: {
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
