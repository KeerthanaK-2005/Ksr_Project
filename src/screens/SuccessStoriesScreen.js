import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, StatusBar, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddStoryForm from '../components/AddStoryForm';
import ViewStories from '../components/ViewStories';
import AppHeader from '../components/AppHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import i18n from '../locales/i18n';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTabBarVisibilityOnScroll } from '../navigation/TabBarVisibilityContext';

const SuccessStoriesScreen = () => {
  const { t, i18n } = useTranslation();
  const [stories, setStories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const isTamil = i18n.language === 'ta';

  const navigation = useNavigation();
  const { initialTab, setInitialTab } = useContext(AuthContext);
  const handleTabBarScroll = useTabBarVisibilityOnScroll();

  useFocusEffect(
    React.useCallback(() => {
      if (initialTab === 'Stories') {
        setInitialTab(null);
      }
    }, [initialTab])
  );

  useEffect(() => {
          fetch('http://172.16.2.108:3000/success-stories')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.data)) {
          // Map backend response to frontend structure directly
          const mappedStories = data.data.map(story => {
            let images = [];
            if (Array.isArray(story.photoUrl)) {
              images = story.photoUrl;
            } else if (typeof story.photoUrl === 'string' && story.photoUrl.startsWith('[')) {
              try {
                images = JSON.parse(story.photoUrl);
              } catch (e) {
                images = [];
              }
            } else if (story.photoUrl) {
              images = [story.photoUrl];
            }
            return {
              id: String(story.id),
              names: `${story.groomName} & ${story.brideName}`,
              story: story.successStory,
              marriageDate: story.marriageDate,
              images,
              matrimonyId: String(story.userId),
              address: story.address || '',
              countryLivingIn: story.countryLivingIn || '',
              telephone: story.telephone || '',
              partnerMatrimonyId: story.partneruserId ? String(story.partneruserId) : '',
              engagementDate: story.engagementDate || '',
              likes: story.likes || 0,
              comments: Array.isArray(story.comments) ? story.comments : [],
            };
          });
          setStories(mappedStories);
          console.log('Fetched stories:', mappedStories);
        } else {
          setStories([]);
        }
      })
      .catch(err => {
        console.error('Error fetching stories:', err);
        setStories([]);
      });
  }, []);

  const handleAddStory = (newStory) => {
    // setStories([newStory, ...stories]); // Do NOT add unapproved story to the list
    Alert.alert(t('success'), t('story_submitted_for_review'));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppHeader />
      
      <View style={styles.titleContainer}>
        <View style={[styles.titleWrapper, isTamil && { width: 140 }]}>
          {isTamil ? (
            <>
              <Text style={[styles.title, { fontSize: 16, textAlign: 'left' }]}>வெற்றி</Text>
              <Text style={[styles.title, { fontSize: 16, textAlign: 'left' }]}>கதைகள்</Text>
            </>
          ) : (
            <Text style={styles.title}>{t('success_stories')}</Text>
          )}
        </View>
        <TouchableOpacity style={[styles.addButton, isTamil && { width: 140, height: 65 }]} onPress={() => setModalVisible(true)}>
          <Icon name="create-outline" size={20} color={COLORS.primary} />
          {isTamil ? (
            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={[styles.addButtonText, { fontSize: 13, textAlign: 'left' }]}>உங்கள்</Text>
              <Text style={[styles.addButtonText, { fontSize: 13, textAlign: 'left' }]}>கதையைச்</Text>
              <Text style={[styles.addButtonText, { fontSize: 13, textAlign: 'left' }]}>சேர்க்கவும்</Text>
            </View>
          ) : (
            <Text style={styles.addButtonText}>{t('add_your_story')}</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Remove the outer ScrollView and render ViewStories directly */}
      <ViewStories stories={stories} setStories={setStories} />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{flex: 1}}>
          <AddStoryForm onAddStory={handleAddStory} onClose={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  titleWrapper: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  addButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  languagePickerWrapper: {
    marginLeft: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  languagePicker: {
    width: 110,
    height: 36,
    color: COLORS.primary,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  modalField: {
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: 'bold',
  },
});

export default SuccessStoriesScreen; 