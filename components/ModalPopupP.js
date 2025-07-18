// components/ModalPopup.js

import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Colors from './Colors';

const ModalPopup = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalBox}>
          <Text style={styles.modalText}>🎉 Profile submitted successfully!</Text>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 18,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalClose: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 18,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ModalPopup;
