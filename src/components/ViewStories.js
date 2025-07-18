import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, ScrollView, Dimensions, TextInput, ToastAndroid, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ViewStories = ({ stories, setStories }) => {
  const { t, i18n } = useTranslation();
  const [selectedStory, setSelectedStory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselTimer = useRef(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const isTamil = i18n.language === 'ta';

  const handleCardPress = (story) => {
    setSelectedStory(story);
    setModalVisible(true);
    setCarouselIndex(0);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStory(null);
    setCarouselIndex(0);
    if (carouselTimer.current) clearInterval(carouselTimer.current);
  };

  // Carousel auto-advance for modal
  useEffect(() => {
    if (!selectedStory || !selectedStory.images || selectedStory.images.length <= 1) return;
    carouselTimer.current && clearInterval(carouselTimer.current);
    carouselTimer.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % selectedStory.images.length);
    }, 3000);
    return () => carouselTimer.current && clearInterval(carouselTimer.current);
  }, [selectedStory]);

  // Card image logic
  const getCardImage = (item) => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
    return item.image || null;
  };

  // Card render
  const renderStory = ({ item }) => {
    const cardImage = getCardImage(item);
    return (
      <TouchableOpacity style={styles.storyCard} onPress={() => handleCardPress(item)} activeOpacity={0.85}>
        {cardImage ? (
          <Image source={{ uri: cardImage }} style={styles.storyImage} />
        ) : (
          <View style={[styles.storyImage, { backgroundColor: '#e9ecef' }]} />
        )}
        <View style={styles.storyContent}>
          <View style={styles.dotIndicator} />
          <Text style={styles.storyNames} numberOfLines={1}>{t(item.names)}</Text>
          <Text style={styles.storyText} numberOfLines={2} ellipsizeMode="tail">{t(item.story)}</Text>
          <Text style={styles.marriageDate}>{t(item.marriageDate)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Carousel swipe handler (modal)
  const handleCarouselSwipe = (direction) => {
    if (!selectedStory || !selectedStory.images || selectedStory.images.length <= 1) return;
    setCarouselIndex((prev) => {
      if (direction === 'left') {
        return prev === 0 ? selectedStory.images.length - 1 : prev - 1;
      } else {
        return (prev + 1) % selectedStory.images.length;
      }
    });
  };

  // Dummy user profile for input
  const dummyProfile = { name: 'You', avatar: null };

  // Add like handler
  const handleLike = async (storyId) => {
    try {
      const token = await AsyncStorage.getItem('VivaahAI_accessToken');
      if (!token) throw new Error('User not logged in');

              const res = await fetch(`http://172.16.2.108:3000/like/${storyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        let errorText = await res.text();
        // Show toast/snackbar for already liked error
        if (errorText.includes('already liked')) {
          if (Platform.OS === 'android') {
            ToastAndroid.show('You have already liked this story', ToastAndroid.SHORT);
          } else {
            Alert.alert('Info', 'You have already liked this story');
          }
          return;
        }
        console.error('Full error response:', errorText);
        throw new Error(errorText || 'Failed to like story');
      }

      const data = await res.json();
      setSelectedStory(prev => prev ? { ...prev, likes: data.likes } : prev);
      setStories(prevStories => prevStories.map(s => s.id === String(storyId) ? { ...s, likes: data.likes } : s));
    } catch (err) {
      console.error('Error liking story:', err.message);
      // Optionally show error to user
    }
  };

  // Add comment handler
  const handleAddComment = async () => {
    if (!commentInput.trim() || !selectedStory) return;
    try {
      const token = await AsyncStorage.getItem('VivaahAI_accessToken');
      if (!token) throw new Error('User not logged in');

              const res = await fetch('http://172.16.2.108:3000/comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          successStoryId: selectedStory.id,
          comment: commentInput.trim(),
        }),
      });

      if (!res.ok) {
        let errorText = await res.text();
        console.error('Full error response:', errorText);
        throw new Error(errorText || 'Failed to add comment');
      }

      const data = await res.json();
      setSelectedStory(prev => prev ? { ...prev, comments: [data.data, ...(prev.comments || [])] } : prev);
      setStories(prevStories => prevStories.map(s => s.id === selectedStory.id ? { ...s, comments: [data.data, ...(s.comments || [])] } : s));
      setCommentInput('');
    } catch (err) {
      console.error('Error adding comment:', err.message);
      // Optionally show error to user
    }
  };

  return (
    <>
      <FlatList
        data={stories}
        renderItem={renderStory}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('no_stories_yet')}</Text>
          </View>
        )}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalOverlay} edges={['bottom', 'left', 'right']}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedStory && (
                <>
                  {/* Carousel for multiple images */}
                  {selectedStory.images && selectedStory.images.length > 0 ? (
                    <View style={styles.carouselContainer}>
                      <TouchableOpacity onPress={() => handleCarouselSwipe('left')} style={styles.carouselArrow} disabled={selectedStory.images.length <= 1}>
                        <Icon name="chevron-back-circle" size={32} color={selectedStory.images.length > 1 ? COLORS.primary : '#ccc'} />
                      </TouchableOpacity>
                      <Image
                        source={{ uri: selectedStory.images[carouselIndex] }}
                        style={styles.modalImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity onPress={() => handleCarouselSwipe('right')} style={styles.carouselArrow} disabled={selectedStory.images.length <= 1}>
                        <Icon name="chevron-forward-circle" size={32} color={selectedStory.images.length > 1 ? COLORS.primary : '#ccc'} />
                      </TouchableOpacity>
                    </View>
                  ) : selectedStory.image ? (
                    <Image source={{ uri: selectedStory.image }} style={styles.modalImage} />
                  ) : null}
                  {/* Carousel dots */}
                  {selectedStory.images && selectedStory.images.length > 1 && (
                    <View style={styles.carouselDots}>
                      {selectedStory.images.map((_, idx) => (
                        <View
                          key={idx}
                          style={[styles.carouselDot, carouselIndex === idx && styles.carouselDotActive]}
                        />
                      ))}
                    </View>
                  )}
                  <Text style={styles.modalNames} numberOfLines={1} adjustsFontSizeToFit>{t(selectedStory.names)}</Text>
                  <Text style={[styles.modalField, { flexWrap: 'wrap' }]}><Text style={styles.modalLabel}>{t('story')}: </Text>{t(selectedStory.story)}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>{t('marriage_date')}: </Text>{t(selectedStory.marriageDate)}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>{t('matrimony_id')}: </Text>{selectedStory.matrimonyId}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>{t('address')}: </Text>{selectedStory.address}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Currently Living Country: </Text>{selectedStory.countryLivingIn}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>{t('mobile_number')}: </Text>{selectedStory.telephone}</Text>
                  {selectedStory.partnerMatrimonyId ? (
                    <Text style={styles.modalField}><Text style={styles.modalLabel}>{t('partner_matrimony_id')}: </Text>{selectedStory.partnerMatrimonyId}</Text>
                  ) : null}
                  {selectedStory.engagementDate ? (
                    <Text style={styles.modalField}><Text style={styles.modalLabel}>Engagement Date: </Text>{selectedStory.engagementDate}</Text>
                  ) : null}
                  {/* Like & Comment Buttons - use API data */}
                  <View style={styles.actionRowBest}>
                    <TouchableOpacity onPress={() => handleLike(selectedStory.id)} activeOpacity={0.8}>
                      <View style={styles.actionButtonBest}>
                        <Icon name={'heart-outline'} size={32} color={'#FFB6C1'} style={styles.actionIconBest} />
                        <Text style={styles.actionTextBest}>{selectedStory.likes || 0}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCommentModalVisible(true)} activeOpacity={0.8}>
                      <View style={styles.actionButtonBest}>
                        <Icon name="chatbubble-ellipses" size={32} color={COLORS.gradientEnd} style={styles.actionIconBest} />
                        <Text style={styles.actionTextBest}>{selectedStory.comments ? selectedStory.comments.length : 0}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={{ width: '100%', height: 1, backgroundColor: '#eee', marginVertical: 18 }} />
            </ScrollView>
            <TouchableOpacity style={styles.closeTextButton} onPress={closeModal}>
              <Text style={styles.closeText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={commentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.commentModalOverlay}>
          <View style={styles.commentModalContent}>
            <View style={styles.commentModalHeader}>
              <Text style={styles.commentModalTitle}>{t('comments')} ({selectedStory && selectedStory.comments ? selectedStory.comments.length : 0})</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Icon name="close" size={26} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {/* Render comments from API */}
            <ScrollView style={{ flex: 1 }}>
              {selectedStory && selectedStory.comments && selectedStory.comments.length > 0 ? (
                selectedStory.comments.map((comment, idx) => (
                  <View key={comment.id || idx} style={{ marginBottom: 12 }}>
                    <Text style={{ fontWeight: 'bold' }}>User {comment.userId}</Text>
                    <Text>{comment.comment}</Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>{t('no_comments_yet')}</Text>
              )}
            </ScrollView>
            <View style={styles.commentInputRowOuter}>
              <View style={styles.commentModalAvatar}>
                {dummyProfile.avatar ? (
                  <Image source={{ uri: dummyProfile.avatar }} style={styles.commentModalAvatarImg} />
                ) : (
                  <Text style={styles.commentModalAvatarText}>{dummyProfile.name[0]}</Text>
                )}
              </View>
              <View style={styles.commentInputPill}>
                <TextInput
                  style={styles.commentInputField}
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChangeText={setCommentInput}
                  placeholderTextColor="#aaa"
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                  style={styles.commentInputSend}
                  onPress={handleAddComment}
                >
                  <Icon name="send" size={24} color={COLORS.gradientEnd} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  storyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  storyImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#e9ecef',
  },
  storyContent: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginBottom: 15,
  },
  storyNames: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  storyText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  marriageDate: {
    fontSize: 14,
    color: '#343a40',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: '90%',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    maxHeight: '98%',
    flex: 0,
  },
  modalScrollContent: {
    alignItems: 'flex-start',
    padding: 20,
    flexGrow: 1,
    width: '100%',
  },
  modalImage: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 18,
    marginTop: 10,
  },
  modalNames: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalField: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
  },
  modalLabel: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeTextButton: {
    marginTop: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  carouselArrow: {
    padding: 4,
    zIndex: 2,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#eee',
    marginHorizontal: 3,
  },
  carouselDotActive: {
    backgroundColor: COLORS.primary,
    width: 16,
  },
  actionRowBest: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
    gap: 32,
  },
  actionButtonBest: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(90deg, #FFF0F6 0%, #E0C3FC 100%)', // fallback for RN, use solid color
    backgroundColor: '#FFF0F6',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: '#FF6B81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    marginHorizontal: 8,
  },
  actionIconBest: {
    marginRight: 14,
  },
  actionTextBest: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B81',
  },
  commentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentModalContent: {
    width: '96%',
    maxWidth: 440,
    minHeight: 380,
    maxHeight: 600,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  commentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentModalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  commentModalList: {
    flex: 1,
    minHeight: 180,
    maxHeight: 400,
    marginTop: 4,
    marginBottom: 10,
  },
  commentModalBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  commentModalAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE0EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentModalAvatarText: {
    fontWeight: 'bold',
    color: COLORS.gradientEnd,
    fontSize: 18,
  },
  commentModalName: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
    fontSize: 15,
  },
  commentModalTime: {
    color: '#aaa',
    fontSize: 13,
  },
  commentModalText: {
    color: '#333',
    fontSize: 15,
    marginTop: 2,
  },
  commentInputRowOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  commentInputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginLeft: 8,
  },
  commentInputField: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  commentInputSend: {
    marginLeft: 8,
    padding: 2,
  },
  commentModalAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  commentDeleteBtn: {
    marginLeft: 10,
    marginTop: 2,
    padding: 4,
  },
});

export default ViewStories; 