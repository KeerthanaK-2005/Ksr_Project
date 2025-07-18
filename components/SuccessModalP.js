import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const SuccessModal = ({ visible, onClose, i18n }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.title}>{i18n.t('upload_success')}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{i18n.t('ok')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = {
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: {
    backgroundColor: '#fff', padding: 30, borderRadius: 20,
    alignItems: 'center', width: 300, elevation: 20
  },
  icon: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: '#FF0000', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
};

export default SuccessModal;
