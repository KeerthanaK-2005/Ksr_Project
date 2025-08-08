import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const FilterModal = ({
  visible,
  onClose,
  onApply,
  onClear,
  isPremiumUser = false,
}) => {

  const [filters, setFilters] = useState({});
  const [heightUnit, setHeightUnit] = useState('cm');
  const [selectedCaste, setSelectedCaste] = useState('');
  const [subcastes, setSubcastes] = useState([]);
  const [doshaPreference, setDoshaPreference] = useState(null); // 'consider' or 'not_consider'
  const [ageRange, setAgeRange] = useState([18, 80]); // Default range
const [heightRange, setHeightRange] = useState([120, 210]); // 


  const handleToggleHeightUnit = () => {
  setHeightUnit((prevUnit) => (prevUnit === 'cm' ? 'ft' : 'cm'));
};


  // Dummy data for dropdowns
  const options = {
    age: Array.from({ length: 83 }, (_, i) => 18 + i),
    heightCm: Array.from({ length: 70 }, (_, i) => 120 + i),
    heightFt: ['4ft 6in', '4ft 7in', '4ft 8in', '4ft 9in', '5ft', '5ft 1in', '5ft 2in', '5ft 3in', '5ft 4in', '5ft 5in', '5ft 6in', '5ft 7in', '5ft 8in', '5ft 9in', '6ft', '6ft 1in'],
    religions: ['Hindu', 'Muslim', 'Christian'],
    castes: ['Brahmin', 'Chettiar', 'Nadar'],
    subcastesData: {
      Brahmin: ['Iyer', 'Iyengar'],
      Chettiar: ['Vellan', 'Devanga'],
      Nadar: ['Shanar', 'Gramani'],
    },
    maritalStatus: ['Never Married', 'Divorced', 'Widowed'],
    profileCreatedBy: ['Self', 'Parent', 'Sibling'],
    physicalStatus: ['Normal', 'Physically Challenged'],
    motherTongue: ['Tamil', 'Hindi', 'Malayalam'],
    star: ['Ashwini', 'Bharani', 'Krittika'],
    horoscope: ['Yes', 'No'],
    familyType: ['Joint', 'Nuclear'],
    education: ['BE', 'BTech', 'MBA'],
    employedIn: ['Private', 'Government', 'Business'],
    occupation: ['Engineer', 'Doctor', 'Teacher'],
    income: ['<5 LPA', '5-10 LPA', '10-20 LPA', '20+ LPA'],
    countries: ['India', 'USA', 'Canada'],
    cities: ['Chennai', 'Mumbai', 'Kochi'],
    recentActivity: ['Within a week', 'Within a month'],
    profileTypes: ['Free', 'Premium'],
    nearbyProfiles: [ 'Yes', 'No'],
    citizenship: ['Indian', 'NRI'],
    eating: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'], 
    smoking: [ 'Yes', 'No', 'Occasionally'], 
    drinking: ['Yes', 'No', 'Occasionally'],
  };

  // Reset all filters
const clearFilters = () => {
  setFilters({});
  setSelectedCaste('');
  setSubcastes([]);
  setHeightUnit('cm');
  setDoshaPreference(null);
  onClear(); // <-- Inform MatchesScreen to reset profiles
};


  useEffect(() => {
    if (selectedCaste && options.subcastesData[selectedCaste]) {
      setSubcastes(options.subcastesData[selectedCaste]);
    } else {
      setSubcastes([]);
    }
  }, [selectedCaste]);

  const renderDropdown = (label, key, values, disabled = false, iconName = null) => (
  <View style={[styles.dropdownContainer, disabled && styles.disabled]}>
    <View style={styles.labelWithIcon}>
      {iconName && <Icon name={iconName} size={16} color="#0056D2" style={{ marginRight: 4 }} />}
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.pickerWrapper}>
      <Picker
        enabled={!disabled}
        selectedValue={filters[key] || 'Select'}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      >
        <Picker.Item label="Select" value="Select" />
        {values.map((val, idx) => (
          <Picker.Item key={idx} label={val} value={val} />
        ))}
      </Picker>
    </View>
  </View>
);




  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
  <View style={styles.modalHeader}>
    <Text style={styles.modalTitle}>Filters</Text>
    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
      <Icon name="close" size={22} color="#fff" />
    </TouchableOpacity>
  </View>

  <ScrollView style={styles.scrollArea}>



            <View style={styles.sectionContainer}>
  <Text style={styles.sectionHeader}>
    <Icon name="person-outline" size={16} /> Basic Details
  </Text>
  <View style={styles.ageContainer}>

<Text style={styles.sectionTitle}>Age</Text>
<MultiSlider
  values={[ageRange[0], ageRange[1]]}
  min={18}
  max={80}
  step={1}
  sliderLength={250}
  onValuesChange={values => setAgeRange(values)}
  selectedStyle={{ backgroundColor: '#0056D2' }}
  unselectedStyle={{ backgroundColor: '#D3D3D3' }}
  markerStyle={{
    backgroundColor: '#0056D2',
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }}
/>
<View style={styles.rangeLabels}>
  <Text>{ageRange[0]}</Text>
  <Text>{ageRange[1]}</Text>
</View>
</View>

<View style={styles.ageContainer}>
<View style={styles.toggleRow}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Icon name="height" size={16} color="#0056D2" style={{ marginRight: 4 }} />
    <Text style={styles.heightLabel}>Height</Text>
  </View>
  <View style={styles.unitToggle}>
    <Text style={styles.unitLabel}>cm</Text>
    <Switch
      value={heightUnit === 'ft'}
      onValueChange={handleToggleHeightUnit}
      thumbColor="#fff"
      trackColor={{ false: '#ccc', true: '#0056D2' }}
      style={styles.switch}
    />
    <Text style={styles.unitLabel}>ft</Text>
  </View>
</View>


<MultiSlider
  values={[heightRange[0], heightRange[1]]}
  min={heightUnit === 'cm' ? 120 : 4.0}
  max={heightUnit === 'cm' ? 210 : 7.0}
  step={heightUnit === 'cm' ? 1 : 0.1}
  sliderLength={250}
  onValuesChange={values => setHeightRange(values)}
  selectedStyle={{ backgroundColor: '#0056D2' }}
  unselectedStyle={{ backgroundColor: '#D3D3D3' }}
  markerStyle={{
    backgroundColor: '#0056D2',
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }}
/>

<View style={styles.rangeLabels}>
  <Text>
    {heightUnit === 'cm'
      ? `${heightRange[0]} cm`
      : `${heightRange[0].toFixed(1)} ft`}
  </Text>
  <Text>
    {heightUnit === 'cm'
      ? `${heightRange[1]} cm`
      : `${heightRange[1].toFixed(1)} ft`}
  </Text>
</View>
</View>


  <View style={styles.row}>
    {renderDropdown('Marital Status', 'maritalStatus', options.maritalStatus,  false, 'favorite')}
    {renderDropdown('Created By', 'profileCreatedBy', options.profileCreatedBy, false, 'people')}
  </View>
  <View style={styles.row}>
    {renderDropdown('Religion', 'religion', options.religions,  false, 'public')}
    {renderDropdown('Caste', 'caste', options.castes, false, 'groups')}
  </View>
  {filters.caste && (
    <View style={styles.row}>
      {renderDropdown('Subcaste', 'subcaste', subcastes, false, 'group')}
    </View>
  )}
  <View style={styles.row}>
    {renderDropdown('Mother Tongue', 'motherTongue', options.motherTongue, false, 'record-voice-over')}
    {renderDropdown('Physical Status', 'physicalStatus', options.physicalStatus,  false, 'accessibility')}
  </View>
  <View style={styles.row}>
    {renderDropdown('Star', 'star', options.star, false, 'star')}
    {renderDropdown('Horoscope Match', 'horoscope', options.horoscope, false, 'auto-awesome')}
  </View>
  <View style={styles.row}>
    {renderDropdown('Family Type', 'familyType', options.familyType, false, 'home')}
  </View>
</View>

{/* DOSHA SECTION */}
<View style={styles.sectionContainer}>
  <Text style={styles.sectionHeader}>
    <Icon name="self-improvement" size={16} /> Dosha Matching
  </Text>
  <View style={styles.row}>
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() =>
        setDoshaPreference((prev) => (prev === 'consider' ? null : 'consider'))
      }
    >
      <CheckBox
        value={doshaPreference === 'consider'}
        onValueChange={() =>
          setDoshaPreference((prev) => (prev === 'consider' ? null : 'consider'))
        }
      />
      <Text style={styles.checkboxLabel}>Consider Dosha</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() =>
        setDoshaPreference((prev) =>
          prev === 'not_consider' ? null : 'not_consider'
        )
      }
    >
      <CheckBox
        value={doshaPreference === 'not_consider'}
        onValueChange={() =>
          setDoshaPreference((prev) =>
            prev === 'not_consider' ? null : 'not_consider'
          )
        }
      />
      <Text style={styles.checkboxLabel}>Don't Consider Dosha</Text>
    </TouchableOpacity>
  </View>
</View>

{/* PREMIUM FILTERS SECTION */}
<View style={styles.sectionContainer}>
  <Text style={styles.sectionHeader}>
    <Icon name="lock-outline" size={16} /> Premium Filters
  </Text>
  <View style={styles.row}>
    {renderDropdown('Recently Active', 'recentActivity', options.recentActivity, !isPremiumUser, 'update')}
    {renderDropdown('Profile Type', 'profileType', options.profileTypes, !isPremiumUser,'verified-user')}
  </View>

  {/* PROFESSIONAL DETAILS */}
  <Text style={[styles.sectionSubHeader, { marginTop: 10 }]}>
    <Icon name="work-outline" size={16} /> Professional Details
  </Text>
  <View style={styles.row}>
    {renderDropdown('Education', 'education', options.education, !isPremiumUser,'school')}
    {renderDropdown('Employed In', 'employedIn', options.employedIn, !isPremiumUser,'business-center')}
  </View>
  <View style={styles.row}>
    {renderDropdown('Occupation', 'occupation', options.occupation, !isPremiumUser, 'work')}
    {renderDropdown('Annual Income', 'income', options.income, !isPremiumUser, 'attach-money')}
  </View>
</View>

{/* LOCATION DETAILS */}
<View style={styles.sectionContainer}>
  <Text style={styles.sectionHeader}>
    <Icon name="location-on" size={16} /> Location Details
  </Text>
  <View style={styles.row}>
    {renderDropdown('Country', 'country', options.countries, false,'flag')}
    {renderDropdown('Nearby Profiles', 'nearbyProfiles', options.nearbyProfiles, false, 'location-searching')}
  </View>
  <View style={styles.row}>
    {renderDropdown('Citizenship', 'citizenship', options.citizenship, false, 'public')}
  </View>
</View>

{/* LIFESTYLE SECTION */}
<View style={styles.sectionContainer}>
  <Text style={styles.sectionHeader}>
    <Icon name="emoji-food-beverage" size={16} /> Lifestyle
  </Text>
  <View style={styles.row}>
    {renderDropdown('Eating Habits', 'eating', options.eating, false, 'restaurant')}
    {renderDropdown('Smoking', 'smoking', options.smoking, false, 'smoking-rooms')}
  </View>
  <View style={styles.row}>
    {renderDropdown('Drinking', 'drinking', options.drinking, false, 'local-bar')}
  </View>
</View>

{/* APPLY / CLEAR BUTTONS */}
<View style={styles.buttonRow}>
  <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
    <Text style={styles.clearText}>Clear Filters</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.applyButton}
//onPress={() => onApply({ ...filters, dosha: doshaPreference })}
  >
    <Text style={styles.applyText}>Apply Filters</Text>
  </TouchableOpacity>
</View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  modalContent: {
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
  },
  ageContainer: {
  borderWidth: 1,
  borderColor: '#b1b1b1ff', // or any color matching your UI
  borderRadius: 10,
  padding: 10,
  marginVertical: 10,
  backgroundColor: '#fff', // optional
},

  sectionContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginVertical: 10,
},
sectionSubHeader: {
  fontSize: 14,
  fontWeight: '600',
  color: '#444',
  marginBottom: 5,
  marginTop: 10,
  color: '#0056D2',

},
sliderGroup: {
  marginVertical: 10,
},

sliderLabel: {
  fontSize: 14,
  color: '#333',
  marginBottom: 6,
},

slider: {
  width: '100%',
  height: 40,
  marginBottom: 10,
},

labelWithIcon: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},

sectionTitle: {
  fontWeight: 'bold',
  fontSize: 16,
  marginTop: 20,
  marginBottom: 10,
},

rangeLabels: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: 10,
},

  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#0056D2',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dropdownContainer: {
    flex: 1,
    marginBottom: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    marginBottom: 4,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  heightWithToggle: {
  flex: 1,
  marginBottom: 10,
  position: 'relative',
},
toggleCorner: {
  position: 'absolute',
  top: 5,
  right: 5,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#0056D2',
  zIndex: 10,
},
toggleLabel: {
  fontSize: 12,
  color: '#0056D2',
  marginHorizontal: 4,
},

toggleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},

heightLabel: {
  fontSize: 16,
  color: '#000',
},

unitToggle: {
  flexDirection: 'row',
  alignItems: 'center',
},

unitLabel: {
  fontSize: 14,
  color: '#0056D2',
  marginHorizontal: 5,
},

switch: {
  transform: [{ scaleX: 1 }, { scaleY: 1 }],
},


  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  checkboxLabel: {
    marginLeft: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0056D2',
    padding: 10,
    borderRadius: 8,
  },
  clearText: {
    textAlign: 'center',
    color: '#333',
  },
  applyText: {
    textAlign: 'center',
    color: '#fff',
  },
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 10,
  backgroundColor: '#538ad6ff',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
},

modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
},

closeIcon: {
  backgroundColor: '#9fbeeaff',
  padding: 6,
  borderRadius: 20,
  elevation: 3,
},


});
