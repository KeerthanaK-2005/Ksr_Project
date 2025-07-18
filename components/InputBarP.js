// components/InputBar.js

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from './Colors';

const InputBar = ({ input, setInput, onSend, isEditing }) => {
  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder={
          isEditing
            ? 'Edit your profile details...'
            : 'Type your profile or ask me anything...'
        }
        placeholderTextColor="#888"
        multiline
      />
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={onSend}
        disabled={!input.trim()}
      >
        <Text style={styles.sendIcon}>🚀</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    maxHeight: 120,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
  },
  sendIcon: {
    fontSize: 18,
    color: '#fff',
  },
});

export default InputBar;
