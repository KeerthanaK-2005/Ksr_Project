import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const DEFAULT_STORIES = [
  {
    id: '1',
    names: 'Priya & Rahul',
    story: 'Found each other on our platform and got married within 6 months.',
    date: 'Married on June 15, 2023',
    photo: 'https://images.pexels.com/photos/3650469/pexels-photo-3650469.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '2',
    names: 'Anjali & Vikram',
    story: 'Connected through common interests in music and technology.',
    date: 'Married on March 22, 2023',
    photo: 'https://images.pexels.com/photos/1244627/pexels-photo-1244627.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '3',
    names: 'Meera & Arun',
    story: 'Their story proves that distance is just a number.',
    date: 'Married on December 10, 2023',
    photo: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=500'
  }
];

const AUTO_ADVANCE_INTERVAL = 4000;
const CARD_HEIGHT = 240;
const IMAGE_SIZE = 160;
const STACK_OFFSET = 24;
const STACK_SCALE = 0.92;

const SuccessStories = ({ stories = DEFAULT_STORIES }) => {
  const [current, setCurrent] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(width < 400);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (detail !== null) {
      return;
    }
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stories.length);
    }, AUTO_ADVANCE_INTERVAL);
    return () => clearInterval(timer);
  }, [stories.length, detail]);

  useEffect(() => {
    const onChange = ({ window }) => {
      setIsSmallScreen(window.width < 400);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Helper to get the index for stacking (wraps around)
  const getStackIndex = (idx) => {
    if (idx === current) {
      return 0; // top
    }
    if ((idx === (current + 1) % stories.length)) {
      return 1; // next
    }
    if ((idx === (current + 2) % stories.length)) {
      return 2; // third (optional)
    }
    return -1; // hidden
  };

  // Expanded card dimensions
  const expandedWidth = width * 0.9;
  const expandedHeight = 260;

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Success Stories</Text>
      <View style={[styles.splitRow, isSmallScreen && styles.splitRowVertical]}>
        {/* LEFT: Text Section */}
        {detail === null && (
          <View style={[styles.leftTextContainer, isSmallScreen && styles.leftTextContainerVertical]}>
            <AnimatePresence>
              <MotiView
                key={stories[current].id}
                from={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -40 }}
                transition={{ type: 'timing', duration: 600 }}
              >
                <Text
                  style={[styles.bigText, isSmallScreen && styles.bigTextSmallScreen]}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {stories[current].story}
                </Text>
                <Text style={styles.names}>{stories[current].names}</Text>
                <Text style={styles.date}>{stories[current].date}</Text>
              </MotiView>
            </AnimatePresence>
          </View>
        )}
        {/* RIGHT: Stacked Images */}
        <View style={[styles.rightImageStack, isSmallScreen && styles.rightImageStackVertical, detail && styles.rightImageStackExpanded]}>
          {detail !== null && (
            <TouchableWithoutFeedback onPress={() => setDetail(null)}>
              <MotiView
                key={`detail-${stories[detail.index].id}`}
          style={[
                  styles.imageCard,
                  styles.expandedCard,
            {
                    width: expandedWidth,
                    height: expandedHeight,
                    position: 'relative',
                    alignSelf: 'center',
                  },
                ]}
                animate={{
                  width: expandedWidth,
                  height: expandedHeight,
                  scale: 1,
                  opacity: 1,
                  translateX: 0,
                }}
                transition={{ type: 'timing', duration: 400 }}
              >
            <Image
                  source={{ uri: stories[detail.index].photo }}
                  style={styles.expandedImage}
              resizeMode="cover"
            />
                <View style={styles.detailOverlay}>
                  <Text style={styles.detailStory}>{stories[detail.index].story}</Text>
                  <Text style={styles.detailNames}>{stories[detail.index].names}</Text>
                  <Text style={styles.detailDate}>{stories[detail.index].date}</Text>
                  <Text style={styles.detailClose}>(Tap to close)</Text>
              </View>
              </MotiView>
            </TouchableWithoutFeedback>
          )}
          {detail === null && stories.map((story, idx) => {
            const stackIdx = getStackIndex(idx);
            if (stackIdx === -1) {
              return null;
            }
            if (stackIdx === 0) {
              // Top card is always touchable
              return (
                <TouchableWithoutFeedback
                  key={story.id}
                  onPress={() => setDetail({ index: current })}
                >
                  <MotiView
                    style={[
                      styles.imageCard,
                      isSmallScreen && styles.imageCardVertical,
                      {
                        zIndex: 10,
                        position: 'absolute',
                        right: 0,
                      },
                    ]}
                    from={{
                      opacity: 0,
                      translateX: 60,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      translateX: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      translateX: -60,
                      scale: 0.9,
                    }}
                    transition={{ type: 'timing', duration: 600 }}
                  >
                    <Image
                      source={{ uri: story.photo }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </MotiView>
                </TouchableWithoutFeedback>
              );
            } else {
              // Non-top cards are not touchable
              const zIndex = 10 - stackIdx;
              const translateX = stackIdx * STACK_OFFSET;
              const scale = 1 - (stackIdx * (1 - STACK_SCALE));
              return (
                <MotiView
                  key={story.id}
                  style={[
                    styles.imageCard,
                    isSmallScreen && styles.imageCardVertical,
                    {
                      zIndex,
                      position: 'absolute',
                      right: 0,
                    },
                  ]}
                  from={{
                    opacity: 0,
                    translateX: 60,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1 - stackIdx * 0.18,
                    translateX,
                    scale,
                  }}
                  exit={{
                    opacity: 0,
                    translateX: -60,
                    scale: 0.9,
                  }}
                  transition={{ type: 'timing', duration: 600 }}
                >
                  <Image
                    source={{ uri: story.photo }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </MotiView>
              );
            }
          })}
        </View>
          </View>
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {stories.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, current === idx && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral,
    paddingVertical: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  splitRow: {
    flexDirection: 'row',
    width: width * 0.95,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  splitRowVertical: {
    flexDirection: 'column',
    height: undefined,
  },
  leftTextContainer: {
    flex: 1.2,
    paddingLeft: 12,
    paddingRight: 8,
    justifyContent: 'center',
    maxWidth: width * 0.75,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  leftTextContainerVertical: {
    maxWidth: '100%',
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 0,
    paddingRight: 0,
  },
  bigText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
    lineHeight: 22,
    fontFamily: 'serif',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  bigTextSmallScreen: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 21,
  },
  names: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.secondary,
    opacity: 0.7,
    marginBottom: 4,
  },
  rightImageStack: {
    flex: 1,
    height: IMAGE_SIZE,
    minWidth: IMAGE_SIZE + STACK_OFFSET * 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  },
  rightImageStackVertical: {
    alignItems: 'center',
    minWidth: 0,
    width: '100%',
    height: IMAGE_SIZE,
    marginBottom: 0,
  },
  rightImageStackExpanded: {
    flex: 1,
    height: IMAGE_SIZE,
    minWidth: IMAGE_SIZE + STACK_OFFSET * 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  },
  imageCard: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: '#f8f8f8',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  imageCardVertical: {
    marginTop: 0,
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  expandedImage: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  detailOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailStory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detailNames: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  detailDate: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
  },
  detailClose: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 18,
  },
});

export default SuccessStories; 