import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';

const ImagePickerModal = ({ visible, onClose, onPickImage, onRemoveImage, i18n, hasImage }) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableOpacity style={styles.modalOverlay} onPressOut={onClose}>
      <View style={styles.modalOptions}>
        <TouchableOpacity style={styles.optionBtn} onPress={() => onPickImage(true)}>
          <Text style={styles.optionText}>{i18n.t('take_photo')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBtn} onPress={() => onPickImage(false)}>
          <Text style={styles.optionText}>{i18n.t('pick_gallery')}</Text>
        </TouchableOpacity>
        {hasImage && (
          <TouchableOpacity style={styles.optionBtn} onPress={onRemoveImage}>
            <Text style={[styles.optionText, { color: '#D84315' }]}>{i18n.t('remove_photo')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.optionBtn} onPress={onClose}>
          <Text style={styles.optionText}>{i18n.t('cancel')}</Text>
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
    paddingVertical: 14, paddingHorizontal: 12
  },
  optionText: {
    fontSize: 16, color: '#333'
  }
};

export default ImagePickerModal;
