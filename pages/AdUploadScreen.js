import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  PermissionsAndroid,
  Platform,
  alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';
import { launchImageLibrary } from 'react-native-image-picker';

export default function AdUploadScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [adType, setAdType] = useState('image');
  const [inputMethod, setInputMethod] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [duration, setDuration] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [adVisible, setAdVisible] = useState(false);
  const [durationUnit, setDurationUnit] = useState('seconds');
  const [isAdExpired, setIsAdExpired] = useState(false);
  const [adTimerStarted, setAdTimerStarted] = useState(false);



useEffect(() => {
  let timer;

  if (adVisible && !isAdExpired && adTimerStarted && duration && adType !== 'video') {
    const durationNum = parseFloat(duration);
    const unitToMs = {
      hours: 3600000,
      days: 86400000,
    };

    const durationInMs = durationNum * (unitToMs[durationUnit.toLowerCase()] || 60000);

    timer = setTimeout(() => {
      setIsAdExpired(true);
    }, durationInMs);
  }

  return () => clearTimeout(timer);
}, [adVisible, duration, durationUnit, adType, isAdExpired, adTimerStarted]);


  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleMediaPick = async () => {
    const permissionGranted = await requestStoragePermission();
    if (!permissionGranted) {
      alert('Permission denied');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: adType === 'video' ? 'video' : 'photo',
      selectionLimit: 1,
    });

    if (!result.didCancel && result.assets?.[0]) {
      const file = result.assets[0];
      setUploadedFile({
        uri: file.uri,
        name: file.fileName,
        type: file.type,
      });
    }
  };

  const renderAdPreview = () => {
    const sourceUri = uploadedFile?.uri || adUrl;
    if (!adType || !sourceUri) return null;

  if (adType === 'image') {
  return (
    <View style={[styles.adBox, adVisible && isAdExpired && styles.expiredBox]}>
      {!adVisible && <Text style={styles.previewTag}>PREVIEW</Text>}
      
      <Image
        source={{ uri: sourceUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {adVisible && isAdExpired && (
        <View style={styles.expiredOverlay}>
          <Text style={styles.expiredText}>Ad Expired</Text>
        </View>
      )}
    </View>
  );
}



   if (adType === 'video') {
  return (
    <View style={styles.videoWrapper}>
      {!adVisible && <Text style={styles.previewTag}>PREVIEW</Text>}
      <Video
        source={{ uri: inputMethod === 'url' ? adUrl : uploadedFile?.uri }}
        style={styles.preview}
        resizeMode="cover"
        paused={isAdExpired}
        controls={false}
        onEnd={() => setIsAdExpired(true)}
        ignoreSilentSwitch="ignore"
      />
      {isAdExpired && (
        <View style={styles.expiredOverlay}>
          <Text style={styles.expiredText}>Ad Expired</Text>
        </View>
      )}
    </View>
  );
}


   if (adType === 'iframe') {
  return (
    <View style={styles.iframeWrapper}>
      {!adVisible && <Text style={styles.previewTag}>PREVIEW</Text>}
      <WebView source={{ uri: sourceUri }} />
      {isAdExpired && (
        <View style={styles.expiredOverlay}>
          <Text style={styles.expiredText}>Ad Expired</Text>
        </View>
      )}
    </View>
  );
}


   if (adType === 'link') {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(sourceUri)} disabled={isAdExpired}>
  <View style={styles.linkCard}>
    <Text style={styles.linkTitle}>🔗 Link Preview</Text>
    <Text style={styles.linkUrl}>{sourceUri}</Text>
    <Text style={styles.linkCTA}>Tap to open in browser</Text>

    {isAdExpired && (
      <View style={styles.expiredOverlay}>
        <Text style={styles.expiredText}>Ad Expired</Text>
      </View>
    )}
  </View>
</TouchableOpacity>

  );
}


    return null;
  };

const saveAd = () => {
  if ((adType === 'image' || adType === 'video') && inputMethod === 'url' && !adUrl) {
    Alert.alert('Invalid Input', 'Please enter a valid URL');
    return;
  }

  if (adType !== 'video' && (!duration || isNaN(duration) || parseFloat(duration) <= 0)) {
    Alert.alert('Invalid Duration', 'Please enter a valid positive duration');
    return;
  }

  setIsAdExpired(false);
  setAdVisible(true);
  setModalVisible(false);
  setAdTimerStarted(true); // ✅ Start the timer only after saving
};



  return (
    <View style={styles.container}>
      <TouchableOpacity
  style={styles.createButton}
onPress={() => {
  // Reset all ad data before opening modal
  setAdType('image');
  setAdUrl('');
  setUploadedFile(null);
  setDuration('');
  setInputMethod('');
  setIsAdExpired(false);
  setAdTimerStarted(false);
  setAdVisible(false);        // ✅ ENSURE THIS LINE IS PRESENT
  setModalVisible(true);
}}



>
  <Text style={styles.createButtonText}>Create Advertisement</Text>
</TouchableOpacity>


   {adVisible && (adUrl || uploadedFile) ? (
  <>
    <Text style={styles.adLabel}>Sponsored</Text>
    {renderAdPreview()}
  </>
) : null}





      {/* Modal */}
   <Modal
  isVisible={modalVisible}
  animationIn="zoomIn"
  animationOut="zoomOut"
  backdropOpacity={0.4}
  onBackdropPress={() => setModalVisible(false)}
  style={{ justifyContent: 'center', alignItems: 'center' }}
>
  <View style={styles.popupContainer}>
    <ScrollView contentContainerStyle={styles.modalInnerContent}>
      {/* Header: Close & Reset */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setAdType('image');
              setAdUrl('');
              setUploadedFile(null);
              setDuration('');
              setInputMethod('');
              setIsAdExpired(false);
              setAdTimerStarted(false); // ✅ Prevent accidental timer start
              setAdVisible(false);      // ✅ Prevent premature ad preview

          }}
        >
          <Text style={{ color: 'orange', fontWeight: 'bold' }}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.modalTitle}>Choose Advertisement Type</Text>

      {/* Ad Type Buttons */}
      <View style={styles.typeRow}>
        {['image', 'video', 'iframe', 'link'].map((type) => {
          const iconMap = {
            image: 'image',
            video: 'video-camera',
            iframe: 'code',
            link: 'external-link',
          };
          const isActive = adType === type;

          return (
            <TouchableOpacity
              key={type}
              style={[styles.typeButton, isActive && styles.activeButton]}
              onPress={() => {
                setAdType(type);
                setAdUrl('');
                setUploadedFile(null);
                setDuration('');
                setInputMethod('');
              }}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={iconMap[type]}
                  size={16}
                  color={isActive ? 'white' : '#333'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.typeButtonText, isActive && { color: 'white' }]}>
                  {type.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Input Method */}
      {adType && (
        <>
          {(adType === 'image' || adType === 'video') && (
            <>
              <Text style={styles.label}>Choose Input Method:</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.methodButton, inputMethod === 'url' && styles.activeButton]}
                  onPress={() => {
                    setInputMethod('url');
                    setUploadedFile(null);
                  }}
                >
                  <Text style={styles.typeButtonText}>URL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.methodButton, inputMethod === 'upload' && styles.activeButton]}
                  onPress={() => {
                    setInputMethod('upload');
                    setAdUrl('');
                    setUploadedFile(null);
                    handleMediaPick();
                  }}
                >
                  <Text style={styles.typeButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* URL & Duration Input */}
{((adType === 'image' || adType === 'video') && inputMethod !== '') || adType === 'iframe' || adType === 'link' ? (
  <>
    {(inputMethod === 'url' || adType === 'iframe' || adType === 'link') && (
      <TextInput
        placeholder="Enter URL"
        value={adUrl}
        onChangeText={setAdUrl}
        style={styles.input}
      />
    )}

    {/* Show duration only for non-video ads */}
    {adType !== 'video' && (
      <View style={styles.durationContainer}>
        <TextInput
          placeholder="Display Duration"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={[styles.input, { flex: 1, marginRight: 10 }]}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={durationUnit}
            onValueChange={(itemValue) => setDurationUnit(itemValue)}
            style={styles.picker}
            dropdownIconColor="#FF6B6B"
          >
<Picker.Item label="Hours" value="hours" />
<Picker.Item label="Days" value="days" />


          </Picker>
        </View>
      </View>
    )}

    {renderAdPreview()}
  </>
) : null}

        </>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveAd}>
        <Text style={styles.saveButtonText}>Save Advertisement</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
</Modal>

      {/* WebView Modal */}
      {showWebView && (
        <Modal visible={true} animationType="slide">
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#FF6B6B', padding: 10, alignItems: 'center' }}
              onPress={() => setShowWebView(false)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
            <WebView source={{ uri: adUrl }} style={{ flex: 1 }} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  
createButton: {
  backgroundColor: '#FF6B6B',
  paddingVertical: 16,
  borderRadius: 14,
  alignItems: 'center',
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 5,
},
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
    color: '#444',
  },
adBox: {
  width: '100%',
  height: 250,
  borderRadius: 18,
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  borderWidth: 1.5,
  borderColor: '#FF6B6B',
  shadowColor: '#FF6B6B',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 8,
  marginBottom: 20,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},

  preview: {
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
  resizeMode: 'contain',
},
 modalContainer: {
  flexGrow: 1,
  padding: 20,
  paddingTop: 40,
  backgroundColor: '#fff',
},

 modalTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: '#222',
  marginBottom: 18,
},
typeRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',           
  alignItems: 'center',
  marginVertical: 10,
  gap: 10                     
},

typeButton: {
  backgroundColor: '#eee',
  paddingVertical: 10,
  paddingHorizontal: 14,
  margin: 5,
  borderRadius: 8,
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},

activeButton: {
  backgroundColor: '#FF6B6B',
  borderColor: '#FF3B3B',
  shadowColor: '#FF6B6B',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 6,
  elevation: 6,
},

typeButtonText: {
  color: '#333',
  fontWeight: '600',
  fontSize: 12,
},

methodButton: {
  paddingVertical: 12,
  paddingHorizontal: 18,
  borderRadius: 12,
  backgroundColor: '#f1f1f1',
  borderWidth: 1.5,
  borderColor: '#FF6B6B',
  elevation: 2,
},
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
input: {
  borderWidth: 1.5,
  borderColor: '#FF6B6B',
  padding: 14,
  borderRadius: 10,
  marginBottom: 18,
  fontSize: 15,
  backgroundColor: '#fff',
  color: '#333',
  shadowColor: '#ccc',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 2,
},

saveButton: {
  backgroundColor: '#FF6B6B',
  paddingVertical: 14,
  borderRadius: 16,
  marginTop: 20,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  shadowColor: '#FF6B6B',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 6,
  elevation: 6,
  borderWidth: 1,
  borderColor: '#fff',
},

saveButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  marginLeft: 8,
},
previewTag: {
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: '#FF6B6B',
  color: '#fff',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 'bold',
  zIndex: 1,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},

  linkCard: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
    overflow: 'hidden',

  },
  linkTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#FF6B6B',
  },
  linkUrl: {
    color: '#0066cc',
    textDecorationLine: 'underline',
    marginBottom: 6,
  },
  linkCTA: {
    fontSize: 13,
    color: '#666',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iframeWrapper: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
  },
  playOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  durationContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 10,
},
picker: {
  width: '100%',
  height: 50,
  color: '#333',
},

durationInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  borderRadius: 8,
  width: 100,
  marginRight: 10,
},
picker: {
  height: 50,
  width: 150,
},
adTypeContainer: {
  marginTop: 16,
  paddingHorizontal: 16,
},

heading: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 12,
},

buttonRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12, 
},

button: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderRadius: 8,
},

closeButton: {
  borderColor: '#c0392b',
  marginRight: 10,
},

resetButton: {
  borderColor: '#ccc',
},

buttonText: {
  fontSize: 14,
  color: '#555',
  marginLeft: 4,
},

expiredBox: {
  opacity: 0.4,
},

expiredOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(54, 47, 47, 0.6)',
},

expiredText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#000',                
  backgroundColor: '#fff',      
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
},
popupContainer: {
  backgroundColor: '#fff',
  borderRadius: 20,
  width: '92%',
  maxHeight: '90%',
  padding: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2,
  shadowRadius: 15,
  elevation: 12,
  borderWidth: 2,
  borderColor: '#FF6B6B',
},

modalInnerContent: {
  paddingBottom: 30,
},
});
