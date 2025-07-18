import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageCarousel from './ImageCarousel';

const { width } = Dimensions.get('window');

export default function ProfileCard({ profile }) {
  const [showTooltip, setShowTooltip] = useState(null);

  return (
    <View style={styles.cardWrapper}>
      {/* Badges */}
      <View style={styles.badgeRow}>
        {profile.isPremium && (
          <View style={styles.iconWithTooltip}>
            <TouchableOpacity
              style={styles.iconBackground}
              onPressIn={() => setShowTooltip('premium')}
              onPressOut={() => setShowTooltip(null)}
            >
              <FontAwesome5 name="crown" size={14} color="#FFD700" />
            </TouchableOpacity>
            {showTooltip === 'premium' && (
              <View style={styles.tooltipAbsoluteBelow}>
                <Text style={styles.tooltipText}>Premium</Text>
              </View>
            )}
          </View>
        )}
        {profile.isVerified && (
          <View style={styles.iconWithTooltip}>
            <TouchableOpacity
              style={styles.iconBackground}
              onPressIn={() => setShowTooltip('verified')}
              onPressOut={() => setShowTooltip(null)}
            >
              <MaterialIcons name="verified" size={16} color="#4CAF50" />
            </TouchableOpacity>
            {showTooltip === 'verified' && (
              <View style={styles.tooltipAbsoluteBelow}>
                <Text style={styles.tooltipText}>Verified</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Profile Image */}
      <ImageCarousel images={profile.images || []} />

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Name and Icons Row */}
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>
            {profile.name}, {profile.age}
          </Text>
          <View style={styles.nameIcons}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPressIn={() => setShowTooltip('chat')}
              onPressOut={() => setShowTooltip(null)}
            >
              <FeatherIcon name="message-circle" size={18} color="#fff" />
            </TouchableOpacity>
            {showTooltip === 'chat' && (
              <View style={styles.tooltipBubble}>
                <Text style={styles.tooltipTextAction}>Chat</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.iconCircle}
              onPressIn={() => setShowTooltip('meet')}
              onPressOut={() => setShowTooltip(null)}
            >
              <FeatherIcon name="calendar" size={18} color="#fff" />
            </TouchableOpacity>
            {showTooltip === 'meet' && (
              <View style={styles.tooltipBubble}>
                <Text style={styles.tooltipTextAction}>Meet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <FeatherIcon name="map-pin" size={14} color="#FF6B6B" />
          <Text style={styles.locationText}> {profile.location}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tags}>
          <Text style={styles.tag}>
            <FeatherIcon name="activity" size={12} color="#fff" /> {profile.height}
          </Text>
          <Text style={styles.tag}>
            <FeatherIcon name="users" size={12} color="#fff" /> {profile.religion}
          </Text>
          <Text style={styles.tag}>
            <FeatherIcon name="heart" size={12} color="#fff" /> {profile.maritalStatus}
          </Text>
        </View>

        {/* Chips */}
        <View style={styles.chipRow}>
          <View style={styles.chip}><Text style={styles.chipText}>⚡ AI 93%</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>🎵 Indie Pop</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>✨ Bold Presence</Text></View>
        </View>

        {/* Bio */}
        {profile.bio && (
          <Text style={styles.bioText}>{profile.bio.slice(0, 60)}...</Text>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.dontShowBtn}>
            <Text style={[styles.btnText, { color: '#000' }]}>Don’t Show</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendInterestBtn}>
            <Text style={styles.btnText}>Send Interest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: width * 0.92,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 6,
    marginVertical: 10,
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
    gap: 6,
  },
  iconWithTooltip: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBackground: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tooltipAbsoluteBelow: {
    position: 'absolute',
    top: 33,
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 999,
    elevation: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  tooltipBubble: {
    position: 'absolute',
    bottom: 35,
    backgroundColor: 'transparent',
    zIndex: 100,
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipTextAction: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginRight: -75,
  },
  nameIcons: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
  },
  iconCircle: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
  },
  tag: {
    backgroundColor: '#FF6B6B',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 4,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    backgroundColor: '#ffe6e6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    margin: 4,
  },
  chipText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
  },
  bioText: {
    fontSize: 13,
    color: '#666', 
    marginTop: 6, 
    textAlign: 'center', 
  }, 
  buttonRow: { 
    flexDirection: 'row', 
    marginTop: 14, 
    gap: 12, 
    justifyContent: 'center', 
  }, 
  dontShowBtn: { 
    backgroundColor: '#f2f2f2', 
    paddingHorizontal: 18, 
    paddingVertical: 8, 
    borderRadius: 30, }, 
    sendInterestBtn: { 
      backgroundColor: '#FF6B6B', 
      paddingHorizontal: 18, 
      paddingVertical: 8, 
      borderRadius: 30, 
    }, 
    btnText: { 
        fontWeight: '600', 
        fontSize: 13, 
        color: '#fff', 
      }, 
    });
