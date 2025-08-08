import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const ProfileCard = ({ profile }) => {
  const [imageIndex, setImageIndex] = useState(0);
    const navigation = useNavigation();
    const [activeIcon, setActiveIcon] = useState(null);


     useEffect(() => {
    setImageIndex(0);
  }, [profile]);
  
  const nextImage = () => {
    setImageIndex((imageIndex + 1) % profile.images.length);
  };

  const prevImage = () => {
    setImageIndex((imageIndex - 1 + profile.images.length) % profile.images.length);
  };

  return (
    
    <View style={styles.card}>
      <Image source={{ uri: profile.images[imageIndex] }} style={styles.image} />

      <TouchableOpacity style={styles.leftArrow} onPress={prevImage}>
        <Icon name="chevron-left" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rightArrow} onPress={nextImage}>
        <Icon name="chevron-right" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Vertical Icon Column on Image */}



     <View style={styles.info}>
 <View style={styles.infoRow}>
  <View style={{marginTop:90}}>
    <Text style={styles.name}>{profile.name}</Text>
    <Text style={styles.profession}>{profile.profession}</Text>
  </View>

 <View style={styles.iconColumn}>
 <TouchableOpacity
  style={[
    styles.iconButton,
    activeIcon === 'heart' && styles.iconBoxActive,
  ]}
  onPress={() => {
    setActiveIcon('heart');
    navigation.navigate('MatchSuccess');
  }}
>
  <Icon name="heart" size={20} color="#fff" />
</TouchableOpacity>


  <TouchableOpacity
    style={[
      styles.iconButton,
      activeIcon === 'star' && styles.iconBoxActive,
    ]}
    onPress={() => setActiveIcon('star')}
  >
    <Icon name="star" size={20} color="#fff" />
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.iconButton,
      activeIcon === 'share' && styles.iconBoxActive,
    ]}
    onPress={() => setActiveIcon('share')}
  >
    <Icon name="share" size={20} color="#fff" />
  </TouchableOpacity>
</View>

</View>


  <View style={styles.dotsContainer}>
    {profile.images.map((_, idx) => (
      <View
        key={idx}
        style={[styles.dot, imageIndex === idx && styles.activeDot]}
      />
    ))}
  </View>
</View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1 },
  image: {
  width: '100%',
  height: '100%',
  borderRadius: 20,
  position: 'absolute', // ✨ cover the entire card
},

  leftArrow: {
    position: 'absolute',
    top: '50%',
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20
  },
  rightArrow: {
    position: 'absolute',
    top: '50%',
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20
  },
  info: {
  paddingVertical: 8,
  paddingHorizontal: 15,
  backgroundColor: 'transparent', // ✅ no white background
  position: 'absolute', // ✨ overlay at bottom of image
  bottom: 0,
  left: 0,
  right: 0,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
},

  infoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
iconColumn: {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
},


iconButton: {
  backgroundColor: 'rgba(211, 211, 211, 0.59)', // lightgray with transparency
  width: 46,
  height: 46,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 6, // changed from marginLeft for vertical spacing
},

iconBoxActive: {
  backgroundColor: '#a7c8f6ff', // or any color when clicked
},
name: {
  fontSize: 23,
  fontWeight: 'bold',
  color: '#fff',
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},
profession: {
  fontSize: 18,
  color: '#eee',
  textShadowColor: 'rgba(0, 0, 0, 0.95)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 4,
},


  // Dot indicator styles
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 35,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  }
});

export default ProfileCard;
