import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';

const LanguageModal = ({ visible, onSelectLang, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableOpacity style={styles.modalOverlay} onPressOut={onClose}>
      <View style={styles.modalOptions}>
        <TouchableOpacity style={styles.optionBtn} onPress={() => onSelectLang('en')}>
          <Text style={styles.flag}>🇬🇧</Text>
          <Text style={styles.langLabel}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBtn} onPress={() => onSelectLang('ta')}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.langLabel}>தமிழ்</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBtn} onPress={() => onSelectLang('hi')}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.langLabel}>हिंदी</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = {
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center'
  },
  modalOptions: {
    backgroundColor: '#fff', borderRadius: 15, padding: 24, width: 280, alignItems: 'stretch'
  },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12
  },
  flag: { fontSize: 24, marginRight: 10, width: 32, textAlign: 'center' },
  langLabel: { fontSize: 18, color: '#333' }
};

export default LanguageModal;
