import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SwipeHint() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>← Swipe for more →</Text>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  position: 'absolute',
  bottom: 60,
  left: 0,
  right: 0,
  alignItems: 'center',
  zIndex: 1,               
  pointerEvents: 'none',   
},
  text: {
    fontSize: 16,
    color: '#FF6B6B',
    fontStyle: 'italic',
    fontWeight: 'bold',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
});