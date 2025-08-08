import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MatchSuccessScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imagesContainer}>
          <Image
            source={{ uri: 'https://www.expressomagazine.com/wp-content/uploads/2025/01/Shahid-Kapooru.jpg' }}
            style={[styles.profileImage, { transform: [{ rotate: '-15deg' }] }]}
          />
          <Image
            source={{ uri: 'https://images.filmibeat.com/wallpapers/mobi/2018/01/sri-divya_151679050740.jpg' }}
            style={[styles.profileImage, { transform: [{ rotate: '15deg' }] }]}
          />
        </View>

        <Text style={styles.congratsText}>CONGRATULATIONS</Text>
        <Text style={styles.matchText}>It's a match, Jake!!</Text>
        <Text style={styles.subText}>Start a conversation now with each other</Text>

        <TouchableOpacity style={styles.helloButton}>
          <Text style={styles.helloButtonText}>Say Hello!!!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Matches')}>
  <Text style={styles.btnText}>Keep Swiping</Text>
</TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b4cceeff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 170,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#fff',
    marginHorizontal: -20,
  },
  congratsText: {
    fontSize: 14,
    color: '#0056D2',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  helloButton: {
    backgroundColor: '#0056D2',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
  },
  helloButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
 btnText: {
    fontSize: 14,
    color: '#0056D2',
    fontWeight: '600',
  },
});

export default MatchSuccessScreen;
