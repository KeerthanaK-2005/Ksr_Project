import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; 

export default function FiltersModal({
  visible,
  onClose,
  filters,
  onFilterChange,
  onApply,
  onClear,
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [ageError, setAgeError] = useState('');
  const [heightInFeet, setHeightInFeet] = useState(false);
  const isPremium = false;

  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible]);

  const toggleHeightUnit = () => {
    const newUnit = !heightInFeet;
    setHeightInFeet(newUnit);
    setHeightUnit(newUnit ? 'ft' : 'cm');
  };

  const validateAge = (min, max) => {
    if (min < max) {
      setAgeError('Select Age Correctly');
      return false;
    } else {
      setAgeError('');
      return true;
    }
  };

  const handleChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    const min = parseInt(key === 'minAge' ? value : updatedFilters.minAge);
    const max = parseInt(key === 'maxAge' ? value : updatedFilters.maxAge);

    validateAge(min, max);
    setLocalFilters(updatedFilters);
    onFilterChange(key, value);
  };

  const handleApply = () => {
    const min = parseInt(localFilters.minAge);
    const max = parseInt(localFilters.maxAge);
    if (!validateAge(min, max)) return;

    const mappedFilters = {
      minAge: localFilters.minAge,
      maxAge: localFilters.maxAge,
      minHeight: localFilters.minHeight,
      maxHeight: localFilters.maxHeight,
      education: localFilters.education,
      occupation: localFilters.occupation,
      state: localFilters.state,
      city: localFilters.city,
      religion: localFilters.religion,
      caste: localFilters.caste,
      subcaste: localFilters.subcaste,
      star: localFilters.star,
      eating: localFilters.eating,
      smoking: localFilters.smoking,
      drinking: localFilters.drinking,
      country: localFilters.country,
      income: localFilters.income,
      employmentType: localFilters.employmentType,
      institution: localFilters.institution,
      maritalStatus: localFilters.maritalStatus,
      motherTongue: localFilters.motherTongue,
      profileCreatedFor: localFilters.profileCreatedFor,
      physicalStatus: localFilters.physicalStatus,
      horoscope: localFilters.horoscope,
      familyStatus: localFilters.familyStatus,
      familyType: localFilters.familyType,
      dosha: localFilters.dosha,
      profileType: localFilters.profileType,
      recentlyActive: localFilters.recentlyActive,
      nearbyProfiles: localFilters.nearbyProfiles,
      citizenship: localFilters.citizenship,
    };

    onApply(mappedFilters);
  };

  const handleClear = () => {
    const resetFilters = {
      minAge: '', maxAge: '', height: '', minHeight: '', maxHeight: '',
      profileCreatedFor: '', maritalStatus: '', motherTongue: '', physicalStatus: '',
      religion: '', caste: '', subCaste: '', subcaste: '', star: '', horoscope: '', dosha: '',
      familyStatus: '', familyValue: '', familyType: '', recentlyActive: '', profileType: '',
      occupation: '', income: '', employmentType: '', education: '', institution: '',
      nearbyProfiles: '', country: '', citizenship: '', city: '',
      eating: '', smoking: '', drinking: ''
    };
    setLocalFilters(resetFilters);
    setHeightUnit('cm');
    setHeightInFeet(false);
    onClear();
  };

  const heightOptionsCm = ['Select', '140 cm', '145 cm', '150 cm', '155 cm', '160 cm'];
  const heightOptionsFt = ['Select', '4\'6"', '4\'9"', '5\'0"', '5\'3"', '5\'6"'];

  const renderPicker = (label, key, options, icon, disabled = false, premiumOnly = false) => {
    const isDisabled = disabled || premiumOnly;

    return (
      <View style={styles.pickerContainer}>
        <View style={styles.iconLabelContainer}>
          <View style={styles.iconCircle}>
            <FontAwesome name={icon} size={12} color="#fff" />
          </View>
          <Text style={styles.labelText}>{label}</Text>
        </View>
        <View style={[styles.pickerBox, isDisabled && styles.disabledBox]}>
          <Picker
            enabled={!isDisabled}
            selectedValue={localFilters[key]}
            style={isDisabled ? styles.disabledPicker : styles.picker}
            dropdownIconColor={isDisabled ? '#ccc' : '#FF6B6B'}
            onValueChange={(value) => handleChange(key, value)}
          >
            {options.map(opt => (
              <Picker.Item key={opt} label={opt} value={opt === 'Select' ? '' : opt} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✖ Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollArea}>
            <View style={styles.section}>
              <View style={styles.row}>
                {renderPicker('Min Age', 'minAge', ['Select', '20', '21', '22', '23', '24', '25', '26', '27'], 'user')}
                <View style={{ flex: 1 }}>
                  {renderPicker('Max Age', 'maxAge', ['Select', '26', '27', '28', '29', '30', '31', '32'], 'user')}
                  {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
                </View>
              </View>

              <View style={styles.heightTitleRow}>
                <View style={styles.iconLabelContainer}>
                  <View style={styles.iconCircle}>
                    <FontAwesome name="arrows-v" size={12} color="#fff" />
                  </View>
                  <Text style={styles.labelText}>Height Unit</Text>
                </View>
                <View style={styles.unitToggleRow}>
                  <Text style={[styles.unitLabel, !heightInFeet && styles.unitLabelActive]}>cm</Text>
                  <Switch
                    value={heightInFeet}
                    onValueChange={toggleHeightUnit}
                    thumbColor="#fff"
                    trackColor={{ false: '#ccc', true: '#FF6B6B' }}
                    style={styles.unitSwitch}
                  />
                  <Text style={[styles.unitLabel, heightInFeet && styles.unitLabelActive]}>ft</Text>
                </View>
              </View>

              <View style={styles.row}>
                {renderPicker('Min Height', 'minHeight', heightUnit === 'cm' ? heightOptionsCm : heightOptionsFt, 'arrows-v')}
                {renderPicker('Max Height', 'maxHeight', heightUnit === 'cm' ? heightOptionsCm : heightOptionsFt, 'arrows-v')}
              </View>

              <View style={styles.row}>
                {renderPicker('Profile Created For', 'profileCreatedFor', ['Select', 'Self', 'Daughter', 'Son'], 'user')}
                {renderPicker('Marital Status', 'maritalStatus', ['Select', 'Never Married', 'Divorced'], 'heart')}
              </View>

              <View style={styles.row}>
                {renderPicker('Mother Tongue', 'motherTongue', ['Select', 'Tamil', 'Hindi'], 'language')}
                {renderPicker('Physical Status', 'physicalStatus', ['Select', 'Normal', 'Disabled'], 'heartbeat')}
              </View>

              <View style={styles.row}>
                {renderPicker('Religion', 'religion', ['Select', 'Hindu', 'Muslim'], 'university')}
                {renderPicker('Caste', 'caste', ['Select', 'Brahmin', 'Kshatriya'], 'users')}
              </View>

              {localFilters.caste ? (
                <View style={styles.row}>
                  {renderPicker('Subcaste', 'subcaste', ['Select', 'Iyer', 'Iyengar'], 'user')}
                </View>
              ) : null}

              <View style={styles.row}>
                {renderPicker('Star', 'star', ['Select', 'Ashwini', 'Bharani'], 'star')}
                {renderPicker('Horoscope', 'horoscope', ['Select', 'Yes', 'No'], 'book')}
              </View>

              <View style={styles.row}>
                {renderPicker('Family Status', 'familyStatus', ['Select', 'Middle', 'Upper'], 'home')}
                {renderPicker('Family Type', 'familyType', ['Select', 'Joint', 'Nuclear'], 'home')}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.iconLabelContainer}>
                <View style={styles.iconCircle}>
                  <FontAwesome name="medkit" size={12} color="#fff" />
                </View>
                <Text style={styles.labelText}>Dosha</Text>
              </View>
              <View style={styles.checkboxRow}>
                <View style={styles.checkboxBox}>
                  <CheckBox
                    value={localFilters.dosha === 'Consider'}
                    onValueChange={() => handleChange('dosha', 'Consider')}
                    tintColors={{ true: '#FF6B6B', false: '#FF6B6B' }}
                  />
                  <Text style={styles.checkboxLabel}>Consider</Text>
                </View>
                <View style={styles.checkboxBox}>
                  <CheckBox
                    value={localFilters.dosha === 'Not Consider'}
                    onValueChange={() => handleChange('dosha', 'Not Consider')}
                    tintColors={{ true: '#FF6B6B', false: '#FF6B6B' }}
                  />
                  <Text style={styles.checkboxLabel}>Not Consider</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.labelText}>Premium Filters</Text>
                <View style={styles.iconWrapper}>
                  <FontAwesome name="lock" size={14} color="#fff" />
                </View>
              </View>
              <View style={styles.row}>
                {renderPicker('Recently Active', 'recentlyActive', ['Select', 'Last 24h', 'Last Week'], 'clock-o', !isPremium, true)}
                {renderPicker('Profile Type', 'profileType', ['Select', 'With Photo', 'Mutual Matches'], 'id-badge', !isPremium, true)}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.labelText}>Professional Details</Text>
                <View style={styles.iconWrapper}>
                  <FontAwesome name="briefcase" size={14} color="#fff" />
                </View>
              </View>
              <View style={styles.row}>
                {renderPicker('Occupation', 'occupation', ['Select', 'Engineer', 'Doctor', 'Teacher'], 'briefcase', !isPremium, true)}
                {renderPicker('Income', 'income', ['Select', '3-5 LPA', '5-10 LPA', '10+ LPA'], 'money', !isPremium, true)}
              </View>
              <View style={styles.row}>
                {renderPicker('Employment Type', 'employmentType', ['Select', 'Private', 'Government', 'Business'], 'building', !isPremium, true)}
                {renderPicker('Education', 'education', ['Select', 'Bachelors', 'Masters', 'PhD'], 'graduation-cap', !isPremium, true)}
              </View>
              <View style={styles.row}>
                {renderPicker('Institution', 'institution', ['Select', 'IIT', 'Anna University', 'Other'], 'university', !isPremium, true)}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.labelText}>Location Details</Text>
                <View style={styles.iconWrapper}>
                  <FontAwesome name="map-marker" size={14} color="#fff" />
                </View>
              </View>
              <View style={styles.row}>
                {renderPicker('Nearby Profiles', 'nearbyProfiles', ['Select', 'Yes', 'No'], 'location-arrow')}
                {renderPicker('Country', 'country', ['Select', 'India', 'USA', 'UK'], 'globe')}
              </View>
              <View style={styles.row}>
                {renderPicker('City', 'city', ['Select', 'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Delhi'], 'building')}
                {renderPicker('Citizenship', 'citizenship', ['Select', 'Indian', 'NRI'], 'flag')}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.labelText}>Lifestyle</Text>
                <View style={styles.iconWrapper}>
                  <FontAwesome name="cutlery" size={14} color="#fff" />
                </View>
              </View>
              <View style={styles.row}>
                {renderPicker('Eating Habits', 'eating', ['Select', 'Vegetarian', 'Non-Vegetarian', 'Eggetarian'], 'cutlery')}
                {renderPicker('Smoking', 'smoking', ['Select', 'Yes', 'No', 'Occasionally'], 'ban')}
              </View>
              <View style={styles.row}>
                {renderPicker('Drinking', 'drinking', ['Select', 'Yes', 'No', 'Occasionally'], 'glass')}
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnGray} onPress={handleClear}>
                <Text style={styles.btnText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnAccent, ageError ? { backgroundColor: '#ccc' } : null]}
                onPress={handleApply}
                disabled={!!ageError}
              >
                <Text style={styles.btnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollArea: {
    padding: 12,
  },
  section: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
    margin: 6,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  disabledBox: {
    backgroundColor: '#f1f1f1',
    borderColor: '#ccc',
  },
  disabledPicker: {
    height: 50,
    color: '#999',
  },
  premiumNote: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
  },
  errorText: {
  color: 'red',
  fontSize: 12,
  marginTop: 4,
  marginLeft: 4,
},

  subTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#FF6B6B',
  },
  heightToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  checkboxBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 6,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btnGray: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 10,
    marginRight: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnAccent: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 10,
    marginLeft: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  labelRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
  marginTop:6,
},

iconWrapper: {
  width: 24,
  height: 24,
  backgroundColor: '#FF6B6B',
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
},
heightTitleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 5,
  paddingHorizontal: 4,
},

unitToggleRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

unitLabel: {
  fontSize: 13,
  fontWeight: '600',
  color: '#999',
  marginHorizontal: 3,
},


unitSwitch: {
  transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
},


unitSwitchRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 8,
},

unitLabelActive: {
  color: '#FF6B6B',
  fontSize: 16,
},

labelText: {
  fontWeight: 'bold',
  color: '#FF6B6B',
  fontSize: 14,
},
toggleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

iconLabelContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
  paddingLeft: 2,
},
iconCircle: {
  backgroundColor: '#FF6B6B',
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 6,
},
labelText: {
  fontWeight: 'bold',
  color: '#FF6B6B',
},

});