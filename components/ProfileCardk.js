import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCarousel from './ImageCarouselk';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;

export default function ProfileCard({ profile }) {
  if (!profile) return null; // ⛔ prevent crash
  const [showTooltip, setShowTooltip] = useState(null);
  const visibleTags = profile.vibeTags?.slice(0, 3) || [];

  const name = profile.name || 'Name';
  const age = profile.age || 'Age';
  const location = profile.location || 'Location';
  const images = profile.images?.length ? profile.images : ['https://via.placeholder.com/300'];

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <ImageCarousel images={images} />


<View style={styles.badgeRowRight}>
  {profile.premium && (
   <View style={styles.iconWithTooltip}>
  <TouchableOpacity
        style={styles.iconBackground}
    onPressIn={() => setShowTooltip('premium')}
    onPressOut={() => setShowTooltip(null)}
  >
<MaterialIcons name="crown" size={18} color="#FFD700" />
  </TouchableOpacity>

  {showTooltip === 'premium' && (
    <View style={styles.tooltipAbsoluteBelow}>
      <Text style={styles.tooltipText}>Premium</Text>
    </View>
  )}
</View>

  )}

{profile.verified && (
  <View style={styles.iconWithTooltip}>
    <TouchableOpacity
          style={styles.iconBackground}
      onPressIn={() => setShowTooltip('verified')}
      onPressOut={() => setShowTooltip(null)}
    >
      <Feather name="check-circle" size={18} color="#28C76F" />
    </TouchableOpacity>
    {showTooltip === 'verified' && (
      <View style={styles.tooltipAbsoluteBelow}>
        <Text style={styles.tooltipText}>Verified</Text>
      </View>
    )}
  </View>
)}

</View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
          <View style={styles.nameRow}>
            <Text style={styles.nameHighlight}>{profile.name}</Text>
            <Text style={styles.nameMeta}>, {profile.age} • {profile.location}</Text>
          </View>

          <View style={styles.iconRow}>
            <View style={styles.iconWithLabel}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPressIn={() => setShowTooltip('meet')}
                onPressOut={() => setShowTooltip(null)}
              >
                <Feather name="calendar" size={16} color="#fff" />
              </TouchableOpacity>
              {showTooltip === 'meet' && (
  <View style={styles.tooltipBubble}>
    <Text style={styles.tooltipTextAction}>Meet</Text>
  </View>
)}

            </View>

            <View style={styles.iconWithLabel}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPressIn={() => setShowTooltip('chat')}
                onPressOut={() => setShowTooltip(null)}
              >
                <Feather name="message-circle" size={16} color="#fff" />
              </TouchableOpacity>
             {showTooltip === 'chat' && (
  <View style={styles.tooltipBubble}>
    <Text style={styles.tooltipTextAction}>Chat</Text>
  </View>
)}
            </View>
          </View>
        </View>

        <View style={styles.matchTagRow}>
          <View style={styles.aiPill}>
            <Feather name="zap" size={12} color="#FF6B6B" />
            <Text style={styles.aiText}>AI {profile.aiMatch}%</Text>
          </View>

          {visibleTags.map((tag, index) => (
            <View key={index} style={styles.vibeTag}>
              <Feather name={tag.icon} size={12} color="#FF6B6B" />
              <Text style={styles.vibeTagText}>{tag.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.dontShowButton}>
            <Feather name="eye-off" size={16} color="#666" />
            <Text style={styles.dontShowText}>Don't Show</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendInterest}>
            <Feather name="heart" size={16} color="#fff" />
            <Text style={styles.actionText}>Send Interest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'visible',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 30,
  },
  imageWrapper: {
    height: 280,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  iconBadge: {
    position: 'absolute',
    top: 12,
    zIndex: 10,
  },
  infoSection: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  nameHighlight: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  nameMeta: {
    fontSize: 17,
    color: '#444',
    fontWeight: '500',
    marginLeft: 4,
  },
  iconRow: {
  flexDirection: 'row',
  gap: 16,
  paddingTop: 0,           // remove extra top space
  marginTop: -4,           // move slightly up (adjust value if needed)
  alignItems: 'center',    // ensures vertical centering with name
},


iconWithLabel: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  height: 40, // ✅ consistent height for vertical alignment
},

tooltipBubble: {
  position: 'absolute',
  bottom: 35,
  backgroundColor: 'transparent', // ✅ Remove background
  paddingHorizontal: 0,           // Optional: reduce spacing
  paddingVertical: 0,
  borderRadius: 0,
  zIndex: 100,
  elevation: 0,
  minWidth: 0,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: 'transparent',     // ✅ Remove shadow
},


iconWithTooltipFixed: {
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 38, // enough for icon + tooltip spacing
},

tooltipPlaceholder: {
  height: 16, // reserve space (adjust as needed)
  justifyContent: 'center',
  alignItems: 'center',
},

tooltipBubbleTop: {
  position: 'absolute',
  top: 25,
  backgroundColor: '#FF6B6B',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
  zIndex: 100,
  elevation: 5,
  alignSelf: 'center',

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',

  // ✅ Ensure it has room to grow
  minWidth: 70,
  maxWidth: 150,
},
badgeRowRight: {
  position: 'absolute',
  top: 12,
  right: 12,
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
},

iconWithTooltip: {
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},

tooltipText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: '600',
  textAlign: 'center',
  includeFontPadding: false,
  textAlignVertical: 'center',
},

tooltipTextAction: {
  color: '#FF6B6B',           // your desired color for Meet/Chat
  fontSize: 13,
  fontWeight: '600',
  backgroundColor: 'transparent',
  textAlign: 'center',
},
iconBackground: {
  backgroundColor: '#fff',      // or any color you prefer
  borderRadius: 20,
  padding: 6,
  elevation: 4,                 // optional for shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},

absoluteIconWrapper: {
  position: 'absolute',
  top: 12,
  alignItems: 'center',
},
tooltipAbsoluteBelow: {
  position: 'absolute',
  top: 33,
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 6,
  zIndex: 999,
  elevation: 5,
  minWidth: 60, 
  alignItems: 'center',
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
  matchTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 15,
    marginTop: 7,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  aiText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  vibeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECEC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  vibeTagText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  sendInterest: {
    width: 140,
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dontShowButton: {
    width: 140,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteTooltipContainer: {
  position: 'absolute',
  bottom: 24, // Moves it *above* the icon
  left: 0,
  right: 0,
  alignItems: 'center',
},
tooltipOverlay: {
  position: 'absolute',
  bottom: 28,  // shows above the icon
  left: '50%',
  transform: [{ translateX: -40 }], // centers above icon (assuming tooltip width ~80)
  zIndex: 999,
},


  dontShowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 6,
  },
});
