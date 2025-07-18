import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import i18n from '../locales/i18n';

const AppHeader = () => {
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [showPicker, setShowPicker] = useState(false);

  const getLanguageLabel = (lang) => {
    return lang === 'en' ? 'Eng' : 'தமிழ்';
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Icon name="heart-circle" size={36} color={COLORS.primary} />
        <View>
          <Text style={styles.appName}>VivaahAi</Text>
          <Text style={styles.appSubtitle}>matrimony</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.languagePickerWrapper}>
            <Icon name="globe-outline" size={20} color={COLORS.primary} style={{ marginLeft: 6, marginRight: 2 }} />
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowPicker(!showPicker)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.languageText}>{getLanguageLabel(language)}</Text>
              <Icon name="chevron-down" size={16} color={COLORS.primary} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
          {showPicker && (
            <View style={styles.customDropdown}>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setLanguage('en');
                  i18n.changeLanguage('en');
                  setShowPicker(false);
              }}
              >
                <Text style={styles.dropdownText}>Eng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => {
                  setLanguage('ta');
                  i18n.changeLanguage('ta');
                  setShowPicker(false);
                }}
              >
                <Text style={styles.dropdownText}>தமிழ்</Text>
              </TouchableOpacity>
          </View>
          )}
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="menu" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF0F6',
    borderBottomWidth: 1,
    borderBottomColor: '#f3c1d8',
    shadowColor: '#FF6B81',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  appSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 8,
    marginTop: -4,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  languagePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 5,
    paddingLeft: 6,
    paddingRight: 2,
    height: 36,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  customDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    minWidth: 90,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 20,
    zIndex: 1000,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'left',
  },
});

export default AppHeader; 