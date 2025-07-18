import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';

const categories = [
  'Photographers', 'DJs', 'Makeup Artists', 'Venues', 'Planners', 'Pandit',
  'Jewellery', 'Mehendi Artists', 'Caterers', 'Wedding Wear', 'Car',
  'Entertainment', 'Choreographers', 'Gifts', 'Invitations', 'Honeymoon',
];

const getCategoryOptions = (category) => {
  switch (category) {
    case 'Photographers': return { prices: ['₹10000', '₹20000', '₹50000'], services: ['Candid', 'Traditional', 'Drone'] };
    case 'DJs': return { prices: ['₹10000', '₹20000'], services: ['Bollywood', 'EDM', 'Punjabi'] };
    case 'Makeup Artists': return { prices: ['₹5000', '₹10000'], services: ['Bridal', 'Party', 'HD'] };
    case 'Venues': return { prices: ['₹25000/day', '₹50000/day'], services: ['Banquet Hall', 'Lawn'] };
    case 'Planners': return { prices: ['₹50000', '₹100000'], services: ['Full Wedding', 'Coordination Only'] };
    case 'Pandit': return { prices: ['₹3000', '₹5000'], services: ['North Indian', 'South Indian'] };
    case 'Jewellery': return { prices: ['₹5000', '₹10000'], services: ['Gold', 'Diamond','silver','platinum'] };
    case 'Mehendi Artists': return { prices: ['₹2000', '₹5000'], services: ['Bridal Mehendi'] };
    case 'Caterers': return { prices: ['₹300/plate', '₹500/plate'], services: ['Veg', 'Non-Veg'] };
    case 'Wedding Wear': return { prices: ['₹5000', '₹10000'], services: ['Lehengas', 'Sherwanis'] };
    case 'Car': return { prices: ['₹3000/day', '₹5000/day'], services: ['Luxury', 'Vintage'] };
    case 'Entertainment': return { prices: ['₹10000', '₹20000'], services: ['Live Band', 'Celebrity'] };
    case 'Choreographers': return { prices: ['₹5000', '₹10000'], services: ['Group Dance', 'Solo'] };
    case 'Gifts': return { prices: ['₹100/item', '₹300/item'], services: ['Custom Gifts', 'Hampers'] };
    case 'Invitations': return { prices: ['₹50/card', '₹100/card'], services: ['Digital', 'Printed'] };
    case 'Honeymoon': return { prices: ['₹20000', '₹50000'], services: ['Domestic', 'International'] };
    default: return { prices: ['₹10000'], services: ['Standard'] };
  }
};

export default function VendorRegistrationForm() {
  const [formData, setFormData] = useState({
    orgName: '', address1: '', address2: '', city: '', state: '', zip: '', country: '',
    firstName: '', lastName: '', phoneDay: '', phoneEvening: '', email: '',
    serviceDetails: '', category: '', additionalServices: '', categoryPrice: '',
    categoryService: '', experience: '', establishDate: new Date(), showDatePicker: false,
    serviceArea: '', businessType: '', insured: false, licensed: false,
    sales: '', bankName: '', beneficiaryName: '', accountNumber: '', signature: '',
  });

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const handleDateChange = (_, date) => {
    handleChange('showDatePicker', false);
    if (date) handleChange('establishDate', date);
  };
  const handleSubmit = () => {
    console.log(formData);
    alert('Application Submitted!');
  };

  const selectedOptions = getCategoryOptions(formData.category);
  const [servicePhotos, setServicePhotos] = useState([]);
  const pickImage = () => {
  launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
    if (!response.didCancel && !response.errorCode && response.assets) {
      setServicePhotos(response.assets);
    }
  });
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Vendor Registration</Text>
      <Text style={styles.sub}>Complete the form below to register your business</Text>

      <Text style={styles.section}>Company Contact Information</Text>
      {['orgName', 'address1', 'address2', 'city', 'state', 'zip', 'country', 'firstName', 'lastName', 'phoneDay', 'phoneEvening', 'email']
        .map((field, i) => (
          <TextInput
            key={i}
            style={styles.input}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            keyboardType={field.includes('phone') ? 'phone-pad' : field === 'email' ? 'email-address' : 'default'}
            onChangeText={(val) => handleChange(field, val)}
          />
        ))}

      <Text style={styles.section}>Company Overview</Text>
      <TextInput
        style={[styles.input, { height: 90 }]}
        multiline
        placeholder="General Service Description"
        onChangeText={(val) => handleChange('serviceDetails', val)}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.picker}>
        <Picker selectedValue={formData.category} onValueChange={(val) => handleChange('category', val)}>
          <Picker.Item label="Select Category" value="" />
          {categories.map((cat, idx) => <Picker.Item key={idx} label={cat} value={cat} />)}
        </Picker>
      </View>

      {formData.category !== '' && (
        <>
          <Text style={styles.label}>Service Type</Text>
          <View style={styles.picker}>
            <Picker selectedValue={formData.categoryService} onValueChange={(val) => handleChange('categoryService', val)}>
              <Picker.Item label="Select Service" value="" />
              {selectedOptions.services.map((s, i) => <Picker.Item key={i} label={s} value={s} />)}
            </Picker>
          </View>

          <Text style={styles.label}>Price</Text>
          <View style={styles.picker}>
            <Picker selectedValue={formData.categoryPrice} onValueChange={(val) => handleChange('categoryPrice', val)}>
              <Picker.Item label="Select Price" value="" />
              {selectedOptions.prices.map((p, i) => <Picker.Item key={i} label={p} value={p} />)}
            </Picker>
          </View>

          <Text style={styles.label}>Experience</Text>
          <View style={styles.picker}>
            <Picker selectedValue={formData.experience} onValueChange={(val) => handleChange('experience', val)}>
              <Picker.Item label="Select Experience" value="" />
              {['1 Year', '2 Years', '5 Years', '10+ Years'].map((e, i) => <Picker.Item key={i} label={e} value={e} />)}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Additional Services Offered</Text>
      <View style={styles.picker}>
        <Picker selectedValue={formData.additionalServices} onValueChange={(val) => handleChange('additionalServices', val)}>
          <Picker.Item label="Select Additional Service" value="" />
          {categories.filter(cat => cat !== formData.category).map((cat, i) => (
            <Picker.Item key={i} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity onPress={() => handleChange('showDatePicker', true)} style={styles.dateInput}>
        <Text>📅 {formData.establishDate.toDateString()}</Text>
      </TouchableOpacity>
      {formData.showDatePicker && (
        <DateTimePicker
          value={formData.establishDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <TextInput style={styles.input} placeholder="Geographic Service Area" onChangeText={val => handleChange('serviceArea', val)} />
      <TextInput style={styles.input} placeholder="Business Type" onChangeText={val => handleChange('businessType', val)} />

     <View style={styles.toggleRow}>
  <Text style={styles.toggleLabel}>Insured?</Text>
  <View style={styles.toggleGroup}>
    {['Yes', 'No'].map(val => (
      <TouchableOpacity
        key={val}
        style={[
          styles.toggleButton,
          formData.insured === (val === 'Yes') && styles.toggleSelected,
        ]}
        onPress={() => handleChange('insured', val === 'Yes')}
      >
        <Text style={[
          styles.toggleText,
          formData.insured === (val === 'Yes') && styles.toggleTextSelected,
        ]}>{val}</Text>
      </TouchableOpacity>
    ))}
  </View>

  <Text style={styles.toggleLabel}>Licensed?</Text>
  <View style={styles.toggleGroup}>
    {['Yes', 'No'].map(val => (
      <TouchableOpacity
        key={val}
        style={[
          styles.toggleButton,
          formData.licensed === (val === 'Yes') && styles.toggleSelected,
        ]}
        onPress={() => handleChange('licensed', val === 'Yes')}
      >
        <Text style={[
          styles.toggleText,
          formData.licensed === (val === 'Yes') && styles.toggleTextSelected,
        ]}>{val}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>


      <TextInput style={styles.input} placeholder="Gross Annual Sales" keyboardType="numeric" onChangeText={val => handleChange('sales', val)} />

      <Text style={styles.section}>Banking Information</Text>
      <TextInput style={styles.input} placeholder="Bank Name" onChangeText={val => handleChange('bankName', val)} />
      <TextInput style={styles.input} placeholder="Beneficiary Name" onChangeText={val => handleChange('beneficiaryName', val)} />
      <TextInput style={styles.input} placeholder="Account Number" keyboardType="numeric" onChangeText={val => handleChange('accountNumber', val)} />
       
<Text style={styles.section}>Upload Photos of Your Work</Text>

<TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
  <Text style={styles.uploadButtonText}>+ Upload Photos</Text>
</TouchableOpacity>

<View style={styles.photoPreviewContainer}>
  {servicePhotos.map((photo, index) => (
    <Image
      key={index}
      source={{ uri: photo.uri }}
      style={styles.previewImage}
    />
  ))}
</View>
      <Text style={styles.textDeclaration}>
        I hereby affirm that all information provided above is accurate to the best of my knowledge and belief.
      </Text>
      <Text>Date: {new Date().toLocaleDateString()}</Text>
      <TextInput style={[styles.input, { height: 60 }]} placeholder="Company Representative Signature" onChangeText={val => handleChange('signature', val)} />

      <Button title="Send Application" onPress={handleSubmit} color="#333" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6, color: '#f15c5d' },
  sub: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
  section: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#444' },
  label: { fontWeight: '500', marginBottom: 6, marginTop: 10, color: '#222' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10,
    marginBottom: 12, backgroundColor: '#fafafa',
  },
  picker: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12,
    backgroundColor: '#fafafa', overflow: 'hidden',
  },
  dateInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12,
    marginBottom: 12, backgroundColor: '#fafafa',
  },
  checkboxRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 15, gap: 10,
  },
  textDeclaration: {
    fontSize: 12, color: '#666', marginVertical: 20,
  },
  toggleRow: { 
    marginBottom: 20, flexDirection: 'column',gap: 10,
  },
  toggleLabel: {
    fontWeight: '500',marginBottom: 4,color: '#333',
},
toggleGroup: {
  flexDirection: 'row',gap: 10,marginBottom: 10,
},
toggleButton: {
  paddingVertical: 6,paddingHorizontal: 20,borderRadius: 8,borderWidth: 1,
  borderColor: '#ccc',backgroundColor: '#fff',
},
toggleSelected: {
  borderColor: '#f15c5d',backgroundColor: '#f15c5d',
},
toggleText: {
  fontSize: 14,color: '#444',fontWeight: '500',
},
toggleTextSelected: {
  color: '#fff',
},
uploadButton: {
  borderWidth: 1, borderColor: '#f15c5d',borderRadius: 8, padding: 12,
  alignItems: 'center',marginBottom: 12,backgroundColor: '#fff5f5',
},

uploadButtonText: {
  color: '#f15c5d',fontWeight: '600',
},

photoPreviewContainer: {
  flexDirection: 'row',flexWrap: 'wrap',gap: 10,marginBottom: 20,
},

previewImage: {
  width: 80,height: 80,borderRadius: 6,borderWidth: 1,borderColor: '#ccc',
},

});




