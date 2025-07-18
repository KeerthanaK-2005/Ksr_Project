import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/colors';
import CustomButton from './CustomButton';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { authService } from '../services/authService';
import { Picker } from '@react-native-picker/picker';
import { LinearTextGradient } from 'react-native-text-gradient';
import { navigate as globalNavigate } from '../navigation/RootNavigation';

const PROFILE_OPTIONS = [
  'Myself',
  'My Son',
  'My Daughter',
  'My Brother',
  'My Sister',
  'My Friend',
  'My Relative',
];

const GENDER_OPTIONS = ['Male', 'Female'];

const needsGender = (profileFor) => {
  // Only show gender for these options
  return (
    profileFor === 'Myself' ||
    profileFor === 'My Friend' ||
    profileFor === 'My Relative'
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const validateEmail = (email) => {
  // Simple email regex
  return /^\S+@\S+\.\S+$/.test(email);
};

const validateMobile = (mobile) => {
  return /^\d{10}$/.test(mobile);
};

const passwordPolicy = [
  { label: 'At least 8 characters (e.g., aa...)', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (e.g., A)', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One number (e.g., 1)', test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special character (e.g., @, #, $, !)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const SignUpModal = ({ visible, onClose, navigation, onBackToLogin }) => {
  const { login, setInitialTab } = useContext(AuthContext);
  const [profileFor, setProfileFor] = useState('');
  const [gender, setGender] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (visible) {
      setProfileFor('');
      setGender('');
      setForm({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
    }
  }, [visible]);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
    setTouched({ ...touched, [field]: true });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!validateMobile(form.mobile)) newErrors.mobile = 'Mobile number must be exactly 10 digits';
    if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    else {
      passwordPolicy.forEach((rule) => {
        if (!rule.test(form.password)) {
          newErrors.password = 'Password does not meet all requirements';
        }
      });
    }
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    
    setIsSubmitting(true);
    try {
      // Call the new registration API
      await authService.registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phoneNo: form.mobile,
        roleId: 2,
      });
      // Automatic login after successful registration
      const loginSuccess = await login(form.email, form.password);
      if (loginSuccess) {
        setInitialTab('Stories');
        setIsSubmitting(false);
        Alert.alert('Success!', 'Registration successful and you are now logged in.', [
          {
            text: 'OK',
            onPress: () => {
              onClose();
            }
          }
        ]);
      } else {
        setIsSubmitting(false);
        Alert.alert('Registration Successful', 'Registration completed, but automatic login failed. Please login manually.');
        onClose();
      }
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Registration Failed', error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Static Back Arrow */}
          <TouchableOpacity style={styles.staticBackArrow} onPress={onClose}>
            <Text style={{ fontSize: 32, color: COLORS.primary, fontWeight: 'bold', textAlign: 'center', lineHeight: 38 }}>←</Text>
          </TouchableOpacity>
          {/* Centered Title */}
          <Text style={styles.centeredGradientTitle}>Enter Your Details</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 60, marginTop: 12 }} style={{ width: '100%', maxHeight: SCREEN_HEIGHT * 0.7 }} showsVerticalScrollIndicator={false}>
            {/* Profile For Dropdown */}
            <Text style={styles.gradientLabel}>This Profile is for</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={profileFor}
                onValueChange={(itemValue) => setProfileFor(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select..." value="" />
                {PROFILE_OPTIONS.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
            {/* Gender Dropdown (only for certain profiles) */}
            {(profileFor === 'Myself' || profileFor === 'My Friend' || profileFor === 'My Relative') && (
              <>
                <Text style={styles.gradientLabel}>Gender</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select..." value="" />
                    {GENDER_OPTIONS.map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              </>
            )}
            {/* All other fields in one popup */}
            <Text style={styles.gradientLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name..."
              value={form.firstName}
              onChangeText={(v) => handleInputChange('firstName', v)}
            />
            <Text style={styles.gradientLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name..."
              value={form.lastName}
              onChangeText={(v) => handleInputChange('lastName', v)}
            />
            <Text style={styles.gradientLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your mobile number..."
              keyboardType="numeric"
              value={form.mobile}
              onChangeText={(v) => handleInputChange('mobile', v.replace(/[^0-9]/g, '').slice(0, 10))}
              maxLength={10}
            />
            {touched.mobile && errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}
            <Text style={styles.gradientLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email..."
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => handleInputChange('email', v)}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <Text style={styles.gradientLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password..."
              secureTextEntry
              value={form.password}
              onChangeText={(v) => handleInputChange('password', v)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            {touched.password && focusedField === 'password' && (
              <View style={{ marginBottom: 6 }}>
                {passwordPolicy.map((rule, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text style={{ fontSize: 16, marginRight: 6 }}>
                      {rule.test(form.password) ? '✔️' : '❌'}
                    </Text>
                    <Text style={{ color: COLORS.primary, fontSize: 13 }}>
                      {rule.label}
                    </Text>
                  </View>
                ))}
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>
            )}
            <Text style={styles.gradientLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password..."
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(v) => handleInputChange('confirmPassword', v)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
            />
            {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
            <TouchableOpacity
              style={styles.gradientButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButtonBg}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.gradientButtonText}>Register</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 16,
                alignSelf: 'center',
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 25,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: COLORS.primary,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => {
                console.log('Back to Login pressed', typeof onBackToLogin);
                if (typeof onBackToLogin === 'function') {
                  onBackToLogin();
                }
              }}
            >
              <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    width: '88%',
    maxWidth: 380,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  staticBackArrow: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF2E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
  centeredGradientTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 2,
    backgroundColor: 'transparent',
    color: '#FF6B6B',
    letterSpacing: 0.2,
    alignSelf: 'center',
    textAlign: 'center',
  },
  gradientLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
    backgroundColor: 'transparent',
    color: COLORS.primary,
    letterSpacing: 0.2,
    alignSelf: 'flex-start',
    opacity: 1,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 18,
    width: '100%',
  },
  pill: {
    borderWidth: 1,
    borderColor: COLORS.gradientStart,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    backgroundColor: '#fff',
  },
  pillSelected: {
    backgroundColor: COLORS.gradientStart,
    borderColor: COLORS.gradientEnd,
  },
  pillText: {
    color: COLORS.gradientStart,
    fontWeight: '500',
    fontSize: 15,
  },
  pillTextSelected: {
    color: '#fff',
  },
  input: {
    width: '100%',
    alignSelf: 'center',
    height: 50,
    backgroundColor: '#ededed',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 17,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  error: {
    color: COLORS.primary,
    fontSize: 13,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  gradientButton: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 18,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButtonBg: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#ededed',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  picker: {
    width: '100%',
    height: 50,
  },
});

export default SignUpModal; 