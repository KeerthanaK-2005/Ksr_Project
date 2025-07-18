import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Image,
  Platform,
  PermissionsAndroid,
  ScrollView, // Use ScrollView for better layout on small screens
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import AnimatedSubmitButton from './AnimatedSubmitButton';
import { COLORS } from '../constants/colors';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const VALID_COUNTRIES = ['India', 'United States', 'Canada', 'Australia', 'United Kingdom', 'Singapore', 'Malaysia', 'Sri Lanka', 'UAE', 'Qatar', 'Saudi Arabia'];

const AddStoryForm = ({ onAddStory, onClose }) => {
  const { t } = useTranslation();
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [matrimonyId, setMatrimonyId] = useState('');
  const [partnerMatrimonyId, setPartnerMatrimonyId] = useState('');
  const [engagementDate, setEngagementDate] = useState(null);
  const [engagementPickerOpen, setEngagementPickerOpen] = useState(false);
  const [marriageDate, setMarriageDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [howYouMet, setHowYouMet] = useState('');
  const [photos, setPhotos] = useState([]);
  const [address, setAddress] = useState('');
  const [livingCountry, setLivingCountry] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showClose, setShowClose] = useState(true);
  const [brideNameLocked, setBrideNameLocked] = useState(false);
  const [groomNameLocked, setGroomNameLocked] = useState(false);
  const [matrimonyIdLocked, setMatrimonyIdLocked] = useState(false);

  useEffect(() => {
    // Fetch user profile from backend and auto-fill/lock fields
    const fillUserFields = async () => {
      try {
        const token = await AsyncStorage.getItem('VivaahAI_accessToken');
        if (!token) return;
        const response = await fetch('http://172.16.2.108:3000/auth/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const raw = await response.text();
        let data;
        try {
          data = JSON.parse(raw);
          console.log('User profile API response:', data);
        } catch (jsonErr) {
          console.error('Raw response from /auth/user/profile:', raw);
          throw jsonErr;
        }
        if (response.ok && data && data.data) {
          console.log('Profile data for auto-fill:', data.data);
          const { gender, firstName, lastName, userId } = data.data;
          console.log('Setting Matrimony ID:', userId);
          if (gender && gender.toLowerCase() === 'male') {
            setGroomName(`${firstName || ''} ${lastName || ''}`.trim());
            setBrideName('');
            setGroomNameLocked(true);
            setBrideNameLocked(false);
          } else if (gender && gender.toLowerCase() === 'female') {
            setBrideName(`${firstName || ''} ${lastName || ''}`.trim());
            setGroomName('');
            setBrideNameLocked(true);
            setGroomNameLocked(false);
          } else {
            setBrideName(`${firstName || ''} ${lastName || ''}`.trim());
            setGroomName(`${firstName || ''} ${lastName || ''}`.trim());
            setBrideNameLocked(true);
            setGroomNameLocked(true);
          }
          setMatrimonyId(userId ? String(userId) : '');
          setMatrimonyIdLocked(true);
        }
      } catch (e) {
        console.error('Failed to auto-fill user fields:', e);
      }
    };
    // Add local state for locking fields
    setBrideNameLocked(false);
    setGroomNameLocked(false);
    setMatrimonyIdLocked(false);
    fillUserFields();
  }, []);

  const focusAnimation = (inputName) => {
    return {
      borderColor: focusedInput === inputName ? '#FF6F61' : '#EFEFEF',
      color: focusedInput === inputName ? '#FF6F61' : '#A9A9A9',
    };
  };

  const brideAnimation = useMemo(() => focusAnimation('bride'), [focusedInput]);
  const groomAnimation = useMemo(() => focusAnimation('groom'), [focusedInput]);
  const matrimonyIdAnimation = useMemo(() => focusAnimation('matrimonyId'), [focusedInput]);
  const partnerIdAnimation = useMemo(() => focusAnimation('partnerMatrimonyId'), [focusedInput]);
  const howYouMetAnimation = useMemo(() => focusAnimation('howYouMet'), [focusedInput]);
  const addressAnimation = useMemo(() => focusAnimation('address'), [focusedInput]);
  const livingCountryAnimation = useMemo(() => focusAnimation('livingCountry'), [focusedInput]);
  const mobileAnimation = useMemo(() => focusAnimation('mobileNumber'), [focusedInput]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const toRequest =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(toRequest, {
          title: 'Photo Library Permission',
          message: 'This app needs access to your photo library to select a photo.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        });

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleChoosePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'You need to grant storage permission to upload photos.');
      return;
    }
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 - photos.length }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const validPhotos = response.assets.filter(asset => {
          if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
            Alert.alert('File Too Large', `${asset.fileName || 'Photo'} is over 10MB and was not added.`);
            return false;
          }
          return true;
        });
        setPhotos(prev => [...prev, ...validPhotos].slice(0, 10));
      }
    });
  };

  const handleRemovePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!brideName.trim()) {
      Alert.alert('Missing Information', "Please enter the Bride's Name.");
      return;
    }
    if (!groomName.trim()) {
      Alert.alert('Missing Information', "Please enter the Groom's Name.");
      return;
    }
    if (!matrimonyId.trim()) {
      Alert.alert('Missing Information', 'Please enter your Matrimony ID.');
      return;
    }
    if (!howYouMet.trim()) {
      Alert.alert('Missing Information', 'Please share how you met.');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Missing Information', 'Please upload at least one wedding photo.');
      return;
    }
    if (photos.some(p => p.fileSize && p.fileSize > 10 * 1024 * 1024)) {
      Alert.alert('File Too Large', 'Each photo must be under 10MB.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Missing Information', 'Please enter your address.');
      return;
    }
    if (!livingCountry.trim()) {
      Alert.alert('Missing Information', 'Please enter your current living country.');
      return;
    }
    if (!VALID_COUNTRIES.includes(livingCountry.trim())) {
      Alert.alert('Invalid Country', 'Please enter a valid country.');
      return;
    }
    if (!mobileNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter your mobile number.');
      return;
    }
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      Alert.alert('Invalid Mobile Number', 'Mobile number must be exactly 10 digits.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Terms and Conditions', 'You must accept the terms and conditions to proceed.');
      return;
    }
    if (!marriageDate) {
      Alert.alert('Missing Information', 'Please select your marriage date.');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('VivaahAI_accessToken');
      if (!token) throw new Error('User not logged in');
      const formData = new FormData();
      formData.append('brideName', brideName);
      formData.append('groomName', groomName);
      formData.append('userId', matrimonyId);
      formData.append('partneruserId', partnerMatrimonyId);
      formData.append('engagementDate', engagementDate ? engagementDate.toISOString().split('T')[0] : '');
      formData.append('marriageDate', marriageDate.toISOString().split('T')[0]);
      formData.append('address', address);
      formData.append('countryLivingIn', livingCountry);
      formData.append('countryCode', ''); // Add country code if available
      formData.append('telephone', mobileNumber);
      formData.append('successStory', howYouMet);
      // Only allow up to 5 images
      photos.slice(0, 5).forEach((photo, idx) => {
        formData.append('photo', {
          uri: photo.uri,
          name: photo.fileName || `photo${idx + 1}.jpg`,
          type: photo.type || 'image/jpeg',
        });
      });
      // Email is not collected in the form, so leave blank or add if available
      formData.append('email', '');
              const response = await fetch('http://172.16.2.108:3000/submit-success-story', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit story');
      }
      onAddStory({
        id: data.data.id,
        names: `${data.data.groomName} & ${data.data.brideName}`,
        story: data.data.successStory,
        marriageDate: data.data.marriageDate,
        images: Array.isArray(data.data.photoUrl) ? data.data.photoUrl : (data.data.photoUrl ? [data.data.photoUrl] : []),
        matrimonyId: data.data.userId,
        partnerMatrimonyId: data.data.partneruserId,
        engagementDate: data.data.engagementDate,
        address: data.data.address,
        livingArea: data.data.countryLivingIn,
        mobileNumber: data.data.telephone,
        likes: data.data.likes || 0,
        comments: [],
      });
      setBrideName('');
      setGroomName('');
      setMatrimonyId('');
      setPartnerMatrimonyId('');
      setEngagementDate(null);
      setMarriageDate(null);
      setHowYouMet('');
      setPhotos([]);
      setAddress('');
      setLivingCountry('');
      setMobileNumber('');
      setTermsAccepted(false);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      Alert.alert('Error', err.message || 'Failed to submit story.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardWrapper}>
          {showClose && (
            <TouchableOpacity style={styles.closeButtonFloatingAboveCard} onPress={onClose}>
              <Icon name="close-circle" size={40} color="#FF6F61" />
            </TouchableOpacity>
          )}
          <MotiView
            style={styles.card}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            {/* Form Header */}
            <MotiView style={styles.formHeader} from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
              <Text style={styles.formTitle}>{t('addStoryTitle')}</Text>
              <Text style={styles.formSubtitle}>{t('addStorySubtitle')}</Text>
            </MotiView>
            {/* 1. Bride's Name */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 100 }}>
              <Text style={styles.gradientLabel}>{t('brideName')} <Text style={styles.requiredStar}>*</Text></Text>
              <MotiView
                style={styles.inputContainer}
                animate={{ borderColor: brideAnimation.borderColor }}
                transition={{ type: 'timing', duration: 200 }}
              >
                <Icon name="woman-outline" style={[styles.inputIcon, { color: brideAnimation.color }]} size={22} />
                <TextInput
                  style={styles.input}
                  placeholder={t('brideName')}
                  placeholderTextColor="#C7C7CD"
                  value={brideName}
                  onChangeText={setBrideName}
                  onFocus={() => setFocusedInput('bride')}
                  onBlur={() => setFocusedInput(null)}
                  editable={!brideNameLocked}
                />
              </MotiView>
            </MotiView>
            {/* 2. Groom's Name */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 200 }}>
              <Text style={styles.gradientLabel}>{t('groomName')} <Text style={styles.requiredStar}>*</Text></Text>
              <MotiView
                style={styles.inputContainer}
                animate={{ borderColor: groomAnimation.borderColor }}
                transition={{ type: 'timing', duration: 200 }}
              >
                <Icon name="man-outline" style={[styles.inputIcon, { color: groomAnimation.color }]} size={22} />
                <TextInput
                  style={styles.input}
                  placeholder={t('groomName')}
                  placeholderTextColor="#C7C7CD"
                  value={groomName}
                  onChangeText={setGroomName}
                  onFocus={() => setFocusedInput('groom')}
                  onBlur={() => setFocusedInput(null)}
                  editable={!groomNameLocked}
                />
              </MotiView>
            </MotiView>
            {/* 3. Matrimony ID */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 300 }}>
              <Text style={styles.gradientLabel}>{t('matrimonyId')} <Text style={styles.requiredStar}>*</Text></Text>
              <MotiView 
                style={styles.inputContainer} 
                animate={{ borderColor: matrimonyIdAnimation.borderColor }} 
                transition={{ type: 'timing', duration: 200 }}
              >
                <Icon name="id-card-outline" style={[styles.inputIcon, { color: matrimonyIdAnimation.color }]} size={22} />
                <TextInput
                  style={styles.input}
                  placeholder={t('matrimonyId')}
                  placeholderTextColor="#C7C7CD"
                  value={matrimonyId}
                  onChangeText={setMatrimonyId}
                  onFocus={() => setFocusedInput('matrimonyId')}
                  onBlur={() => setFocusedInput(null)}
                  editable={false}
                />
              </MotiView>
            </MotiView>
            {/* 4. Partner Matrimony ID */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 400 }}>
              <Text style={styles.gradientLabel}>{t('partnerMatrimonyId')}</Text>
              <MotiView 
                style={styles.inputContainer} 
                animate={{ borderColor: partnerIdAnimation.borderColor }} 
                transition={{ type: 'timing', duration: 200 }}
              >
                <Icon name="id-card-outline" style={[styles.inputIcon, { color: partnerIdAnimation.color }]} size={22} />
                <TextInput
                  style={styles.input}
                  placeholder={t('partnerMatrimonyId')}
                  placeholderTextColor="#C7C7CD"
                  value={partnerMatrimonyId}
                  onChangeText={setPartnerMatrimonyId}
                  onFocus={() => setFocusedInput('partnerMatrimonyId')}
                  onBlur={() => setFocusedInput(null)}
                />
              </MotiView>
            </MotiView>
            {/* 5. Engagement Date */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 500 }}>
              <Text style={styles.gradientLabel}>{t('engagementDate')}</Text>
              <TouchableOpacity onPress={() => setEngagementPickerOpen(true)} style={styles.inputContainer}>
                <Icon name="calendar-outline" style={styles.inputIcon} size={22} color="#A9A9A9" />
                <Text style={styles.dateText}>{engagementDate ? engagementDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : t('engagementDate')}</Text>
              </TouchableOpacity>
            </MotiView>
            {/* 6. Marriage Date */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 600 }}>
              <Text style={styles.gradientLabel}>{t('marriageDate')} <Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity onPress={() => setDatePickerOpen(true)} style={styles.inputContainer}>
                <Icon name="calendar-outline" style={styles.inputIcon} size={22} color="#A9A9A9" />
                <Text style={styles.dateText}>{marriageDate ? marriageDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : t('marriageDate')}</Text>
              </TouchableOpacity>
            </MotiView>
            {/* 7. How You Met */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 700 }}>
              <Text style={styles.gradientLabel}>{t('howYouMet')} <Text style={styles.requiredStar}>*</Text></Text>
              <MotiView
                style={[styles.inputContainer, styles.textAreaContainer]}
                animate={{ borderColor: howYouMetAnimation.borderColor }}
                transition={{ type: 'timing', duration: 200 }}
              >
                <Icon name="create-outline" style={[styles.inputIcon, { marginTop: 15, color: howYouMetAnimation.color }]} size={22} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t('howYouMet')}
                  placeholderTextColor="#C7C7CD"
                  value={howYouMet}
                  onChangeText={setHowYouMet}
                  multiline
                  onFocus={() => setFocusedInput('howYouMet')}
                  onBlur={() => setFocusedInput(null)}
                />
              </MotiView>
            </MotiView>
            {/* 8. Wedding Photo */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 800 }}>
              <Text style={styles.gradientLabel}>{t('weddingPhoto')} <Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoUploadContainer} disabled={photos.length >= 10}>
                <Icon name="image-outline" style={styles.inputIcon} size={22} color="#A9A9A9" />
                <Text style={styles.photoUploadText} numberOfLines={1}>{photos.length === 0 ? t('choosePhotos') : `${photos.length} photo(s) selected`}</Text>
              </TouchableOpacity>
              {photos.length > 0 && (
                <View style={styles.photoPreviewRow}>
                  {photos.map((p, idx) => (
                    <View key={p.uri} style={styles.photoThumbContainer}>
                      <Image source={{ uri: p.uri }} style={styles.imagePreview} />
                      <TouchableOpacity style={styles.removePhotoBtn} onPress={() => handleRemovePhoto(idx)}>
                        <Icon name="close-circle" size={20} color="#FF6F61" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {photos.length < 10 && (
                <TouchableOpacity onPress={handleChoosePhoto} style={styles.addMorePhotosBtn}>
                  <Text style={styles.addMorePhotosText}>{t('addMorePhotos')}</Text>
                </TouchableOpacity>
              )}
            </MotiView>
            {/* 9. Address */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 900 }}>
              <Text style={styles.gradientLabel}>{t('address')} <Text style={styles.requiredStar}>*</Text></Text>
              <MotiView 
                style={styles.inputContainer} 
                animate={{ borderColor: addressAnimation.borderColor }} 
                transition={{ type: 'timing', duration: 200 }}
              >
                <Icon name="location-outline" style={[styles.inputIcon, { color: addressAnimation.color }]} size={22} />
                <TextInput
                  style={styles.input}
                  placeholder={t('address')}
                  placeholderTextColor="#C7C7CD"
                  value={address}
                  onChangeText={setAddress}
                  onFocus={() => setFocusedInput('address')}
                  onBlur={() => setFocusedInput(null)}
                />
              </MotiView>
            </MotiView>
            {/* 10. Current Living Country */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 1000 }}>
              <Text style={styles.gradientLabel}>Current Living Country <Text style={styles.requiredStar}>*</Text></Text>
              <View style={styles.inputContainer}>
                <Icon name="earth-outline" style={styles.inputIcon} size={22} color="#A9A9A9" />
                <Picker
                  selectedValue={livingCountry}
                  onValueChange={setLivingCountry}
                  style={{ flex: 1, color: '#333' }}
                >
                  <Picker.Item label={t('selectCountry')} value="" />
                  {VALID_COUNTRIES.map((country) => (
                    <Picker.Item key={country} label={country} value={country} />
                  ))}
                </Picker>
              </View>
            </MotiView>
            {/* 11. Mobile Number */}
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 1100 }}>
              <Text style={styles.gradientLabel}>{t('mobileNumber')} <Text style={styles.requiredStar}>*</Text></Text>
              <MotiView 
                style={styles.inputContainer} 
                animate={{ borderColor: mobileAnimation.borderColor }} 
                transition={{ type: 'timing', duration: 200 }}
              >
                <Icon name="call-outline" style={[styles.inputIcon, { color: mobileAnimation.color }]} size={22} />
                <TextInput
                  style={styles.input}
                  placeholder={t('mobileNumber')}
                  placeholderTextColor="#C7C7CD"
                  value={mobileNumber}
                  onChangeText={text => setMobileNumber(text.replace(/[^0-9]/g, ''))}
                  onFocus={() => setFocusedInput('mobileNumber')}
                  onBlur={() => setFocusedInput(null)}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </MotiView>
            </MotiView>
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 1200 }}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setTermsAccepted(!termsAccepted)}>
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <Icon name="checkmark" size={18} color="#fff" />}
                </View>
                <Text style={styles.termsText}>{t('termsAndConditions')}</Text>
              </TouchableOpacity>
            </MotiView>
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <AnimatedSubmitButton isSubmitting={isSubmitting} onPress={handleSubmit} />
            </View>
          </MotiView>
        </View>
      </ScrollView>
      <DatePicker
        modal
        open={datePickerOpen}
        date={marriageDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpen(false);
          setMarriageDate(date);
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
      <DatePicker
        modal
        open={engagementPickerOpen}
        date={engagementDate || new Date()}
        mode="date"
        onConfirm={(date) => {
          setEngagementPickerOpen(false);
          setEngagementDate(date);
        }}
        onCancel={() => {
          setEngagementPickerOpen(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 36,
  },
  closeButtonFloatingAboveCard: {
    position: 'absolute',
    top: -20,
    right: 24,
    zIndex: 1001,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: 24,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  gradientLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
    opacity: 1,
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  requiredStar: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    paddingHorizontal: 18,
    marginBottom: 28,
    height: 58,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    height: '100%',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  textAreaContainer: {
    height: 130,
    alignItems: 'flex-start',
  },
  textArea: {
    paddingTop: 18,
    textAlignVertical: 'top',
  },
  photoUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    paddingHorizontal: 18,
    height: 58,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  photoUploadText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  imagePreview: {
    width: 85,
    height: 85,
    borderRadius: 16,
    marginTop: 15,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
    marginTop: 15,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FF6F61',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxChecked: {
    backgroundColor: '#FF6F61',
  },
  termsText: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
    lineHeight: 22,
  },
  linkText: {
    color: '#FF6F61',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  photoPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginBottom: 10,
    gap: 12,
  },
  photoThumbContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addMorePhotosBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FF6F61',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addMorePhotosText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default AddStoryForm; 