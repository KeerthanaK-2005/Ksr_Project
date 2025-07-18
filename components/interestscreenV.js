/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
/* InterestScreen.js
   One-time dependency (bare RN):
     npm i @react-native-picker/picker @react-native-community/datetimepicker react-native-vector-icons
     cd ios && pod install && cd ..
   Expo:
     expo install @react-native-picker/picker @react-native-community/datetimepicker react-native-vector-icons
*/
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Animated } from 'react-native';
import Toast from 'react-native-root-toast';
/* ---------- SHARED PINK PALETTE ---------- */
const PALETTE = {
  bgScreen: '#FDECEC',
  bgCard:   '#ffffff',
  borderCard: '#f7c6c8',
  primary:  '#f15c5d',
  textPrimary: '#f15c5d',
  textBody: '#444444',

  tabActiveBg:   '#f15c5d',
  tabInactiveBg: '#e0e0e0',
  tabActiveText: '#ffffff',
  tabInactiveText: '#444444',

  filterActive:   '#f15c5d',
  filterInactive: '#e0e0e0',
};

export default function InterestScreen() {
  /* ---------- STATE ---------- */
  const [activeTab, setActiveTab] = useState('received');
  const [filter, setFilter] = useState('All');
   const [searchText, setSearchText] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  

  /* profile + meeting modals */
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileModal, setProfileModal] = useState(false);

  const [meetingModal, setMeetingModal] = useState(false);
  const [meetingProfile, setMeetingProfile] = useState(null);

  /* meeting form fields */
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hour, setHour]     = useState('1');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [place, setPlace]   = useState('');

  /* meeting records */
  const [meetingRecords, setMeetingRecords] = useState({}); // { profileId: {date, hour, minute, period, place} }

  /* ---------- TODAY (for date restriction) ---------- */
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [receivedProfiles, setReceivedProfiles] = useState({});
const [sentProfiles, setSentProfiles] = useState({});
const [matchedProfiles, setMatchedProfiles] = useState({});
const [selectedOnlineId, setSelectedOnlineId] = useState(null);

useEffect(() => {
  if (selectedOnlineId) {
    const timer = setTimeout(() => setSelectedOnlineId(null), 3000);
    return () => clearTimeout(timer);
  }
}, [selectedOnlineId]);


  /* ---------- DUMMY DATA ---------- */
const [receivedList, setReceivedList] = useState([
  {
    id: '1',
    name: 'Ananya Sharma',
    age: 26,
    location: 'Mumbai',
    job: 'Software Engineer',
    caste: 'Brahmin',
    religion: 'Hindu',
    phone: '9876543210',
    bio: 'Tech enthusiast and classical dancer.',
    profilePic: 'https://static.vecteezy.com/system/resources/previews/024/354/297/non_2x/business-woman-isolated-illustration-ai-generative-free-photo.jpg',
    status: 'Pending',
    verified: false,
    premium: true,
    lastSeen: '9h ago',
    matchPercent: 90,
    salary: '₹15 LPA',
    education: 'B.Tech, IIT Bombay',
    familyType: 'Nuclear',
  },
  {
    id: '2',
    name: 'Priya Patel',
    age: 24,
    location: 'Ahmedabad',
    job: 'Graphic Designer',
    caste: 'Patel',
    religion: 'Hindu',
    phone: '9876543211',
    bio: 'Creative mind with a love for colors.',
    profilePic: 'https://img.freepik.com/premium-photo/professional-indian-female-headshots-business-corporate-women_203363-204.jpg?w=2000',
    status: 'Pending',
    verified: true,
    premium: true,
    lastSeen: '7h ago',
    matchPercent: 95,
    salary: '₹9 LPA',
    education: 'B.Des, NID Ahmedabad',
    familyType: 'Joint',
  },
  {
    id: '3',
    name: 'Pradhibha ',
    age: 28,
    location: 'Pune',
    job: 'Doctor',
    caste: 'Desai',
    religion: 'Hindu',
    phone: '9876543212',
    bio: 'Caring soul with a passion for healthcare.',
    profilePic: 'https://static.vecteezy.com/system/resources/previews/038/974/578/non_2x/ai-generated-professional-portrait-of-a-competent-woman-free-photo.jpg',
    status: 'Pending',
    verified: true,
    premium: true,
    lastSeen: 'online',
    matchPercent: 94,
    salary: '₹18 LPA',
    education: 'MBBS, AIIMS',
    familyType: 'Nuclear',
  },
  {
    id: '4',
    name: 'Ritika Singh',
    age: 27,
    location: 'Delhi',
    job: 'Teacher',
    caste: 'Rajput',
    religion: 'Hindu',
    phone: '9876543213',
    bio: 'Educator who loves to read and teach.',
    profilePic: 'https://static.vecteezy.com/system/resources/previews/025/474/309/non_2x/portrait-of-a-professional-woman-in-a-suit-business-woman-standing-in-an-office-ai-generated-photo.jpg',
    status: 'Pending',
    verified: false,
    premium: true,
    lastSeen: 'online',
    matchPercent: 89,
    salary: '₹7.5 LPA',
    education: 'M.A., DU',
    familyType: 'Joint',
  },
  {
    id: '5',
    name: 'Ishita Mehta',
    age: 29,
    location: 'Surat',
    job: 'Architect',
    caste: 'Vaishnav',
    religion: 'Hindu',
    phone: '9876543214',
    bio: 'Design thinker and coffee lover.',
    profilePic: 'https://tse4.mm.bing.net/th/id/OIP.9k_GOA2TNHH70WjDdav4owAAAA',
    status: 'Pending',
    verified: false,
    premium: false,
    lastSeen: '6h ago',
    matchPercent: 83,
    salary: '₹10 LPA',
    education: 'B.Arch, CEPT',
    familyType: 'Nuclear',
  },
]);


// eslint-disable-next-line react-hooks/exhaustive-deps
const sentList = [
  {
    id: '6',
    name: 'Keerthi Rao',
    age: 25,
    location: 'Chennai',
    status: 'Pending',
    phone: '9876500001',
    profilePic: 'https://imgcdn.stablediffusionweb.com/2024/10/2/e422911e-e632-4a91-a4af-110348c278f4.jpg',
    job: 'Photographer',
    bio: 'Capturing life through the lens.',
    verified: true,
    premium: false,
    lastSeen: '4h ago',
    matchPercent: 88,
    salary: '₹8 LPA',
    education: 'Diploma in Photography',
    familyType: 'Nuclear',
  },
  {
    id: '7',
    name: 'Meera Iyer',
    age: 24,
    location: 'Hyderabad',
    status: 'Accepted',
    phone: '9876500002',
    profilePic: 'https://femalecricket.com/wp-content/uploads/2021/12/smriti-mandhana-playing-with-boys-cricket-1200x900.jpg',
    job: 'Writer',
    bio: 'Teller of tales, dreamer of dreams.',
    verified: false,
    premium: false,
    lastSeen: '2h ago',
    matchPercent: 90,
    salary: '₹6 LPA',
    education: 'BA in Literature',
    familyType: 'Joint',
  },
  {
    id: '8',
    name: 'Divya Nair',
    age: 28,
    location: 'Kochi',
    status: 'Declined',
    phone: '9876500003',
    profilePic: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yNF9waG90b19vZl9yZWFsX3dvbWFuX2luX2J1c2luZXNzX3dpdGhfZGV2aWNlX19hOTZhMjAxOC03ZGQ0LTQ0NzgtYWIyNi00M2NhZTQwNGQ3OWRfMS5qcGc.jpg',
    job: 'Lawyer',
    bio: 'Justice seeker and traveler.',
    verified: true,
    premium: false,
    lastSeen: 'online',
    matchPercent: 85,
    salary: '₹12 LPA',
    education: 'LLB, NLSIU',
    familyType: 'Nuclear',
  },
  {
    id: '9',
    name: 'Anjali Verma',
    age: 27,
    location: 'Bhopal',
    status: 'Pending',
    phone: '9876500004',
    profilePic: 'https://i.pinimg.com/originals/36/5a/76/365a7652a54d3731e3a3b74cbc7cea41.png',
    job: 'Researcher',
    bio: 'Explorer of facts and ideas.',
    verified: false,
    premium: true,
    lastSeen: '1h ago',
    matchPercent: 89,
    salary: '₹9.5 LPA',
    education: 'PhD Scholar, JNU',
    familyType: 'Joint',
  },
  {
    id: '10',
    name: 'Pooja Bansal',
    age: 26,
    location: 'Indore',
    status: 'Accepted',
    phone: '9876500005',
    profilePic:'https://media.istockphoto.com/id/1317804578/photo/one-businesswoman-headshot-smiling-at-the-camera.webp?b=1&s=170667a&w=0&k=20&c=cVdVl-0bpliZ0Sduc7ZDkMPwLnbxaMXZONllS39oeFc=',
    job: 'Chef',
    bio: 'Cooking is love made visible.',
    verified: true,
    premium: true,
    lastSeen: '10h ago',
    matchPercent: 93,
    salary: '₹11 LPA',
    education: 'Diploma in Culinary Arts',
    familyType: 'Nuclear',
  },
];



  /* ---------- MATCHES (Accepted only) ---------- */
  const matches = useMemo(
    () => [
      ...receivedList.filter(p => p.status === 'Accepted'),
      
      ...sentList.filter(p => p.status === 'Accepted'),
    ],
    [receivedList, sentList],
  );
  const handleCall = (phoneNumber) => {
  console.log(`Calling ${phoneNumber}...`);
  // If you're integrating with real call functionality later:
  // Linking.openURL(`tel:${phoneNumber}`);
};

const handleMessage = (phoneNumber) => {
  console.log(`Messaging ${phoneNumber}...`);
  // For SMS functionality:
  // Linking.openURL(`sms:${phoneNumber}`);
};

  /* ---------- HELPERS ---------- */
  
  const getFilteredSent = () => {
    const base = sentList.filter(p => p.status !== 'Accepted');
    return filter === 'All' ? base : base.filter(p => p.status === filter);
  };

  const handleResponse = (id, response) =>
    setReceivedList(list =>
      list.map(item => (item.id === id ? { ...item, status: response } : item)),
    );

  /* ---------- PROFILE / MEET MODALS ---------- */
  const openProfile = p => {
    setSelectedProfile(p);
    setProfileModal(true);
  };

  const openMeeting = p => {
    setMeetingProfile(p);
    setMeetingDate(new Date());
    setHour('1');
    setMinute('00');
    setPeriod('AM');
    setPlace('');
    setMeetingModal(true);
  };

  const saveMeeting = () => {
    setMeetingRecords(prev => ({
      ...prev,
      [meetingProfile.id]: {
        date: meetingDate.toDateString(),
        hour,
        minute,
        period,
        place,
      },
    }));
    setMeetingModal(false);
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  const OnlineStatusDot = ({ isOnline }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOnline]);

  return (
    <Animated.View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: isOnline ? '#00C853' : '#BDBDBD',
        marginLeft: 6,
        marginTop: 2,
        shadowColor: isOnline ? '#00C853' : undefined,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        transform: isOnline ? [{ scale: scaleAnim }] : undefined,
      }}
    />
  );
};


  /* ---------- SMALL REUSABLE ---------- */
  const BasicInfo = ({ name, age, location }) => (
    <>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.textBody}>Age {age}</Text>
      <Text style={styles.textBody}>📍 {location}</Text>
    </>
  );
 <View style={styles.tabHeader}>

  <TouchableOpacity
    style={[
      styles.tabButton,
      activeTab === 'received' && styles.tabButtonActive,
      { cursor: 'pointer' }
    ]}
    onPress={() => setActiveTab('received')}
  >
    <Text style={[
      styles.tabText,
      activeTab === 'received' ? styles.tabTextActive : styles.tabTextInactive
    ]}>
      New Interests
    </Text>
    <View style={styles.tabBadge}>
      <Text style={styles.tabBadgeText}>{receivedProfiles.length}</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tabButton,
      activeTab === 'matches' && styles.tabButtonActive,
      { cursor: 'pointer' }
    ]}
    onPress={() => setActiveTab('matches')}
  >
    <Text style={[
      styles.tabText,
      activeTab === 'matches' ? styles.tabTextActive : styles.tabTextInactive
    ]}>
      Matches
    </Text>
    <View style={styles.tabBadge}>
      <Text style={styles.tabBadgeText}>{matches.length}</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tabButton,
      activeTab === 'sent' && styles.tabButtonActive,
      { cursor: 'pointer' }
    ]}
    onPress={() => setActiveTab('sent')}
  >
    <Text style={[
      styles.tabText,
      activeTab === 'sent' ? styles.tabTextActive : styles.tabTextInactive
    ]}>
      Sent
    </Text>
    <View style={styles.tabBadge}>
      <Text style={styles.tabBadgeText}>{sentProfiles.length}</Text>
    </View>
  </TouchableOpacity>

</View>

const filterProfiles = (profiles) => {
  const keyword = searchText.trim().toLowerCase();

  return profiles.filter(profile => {
    const name = (profile.name || '').toLowerCase();
    const job = (profile.job || '').toLowerCase();
    const native = (profile.native || '').toLowerCase();
    const location = (profile.location || '').toLowerCase();
    const age = profile.age ? profile.age.toString() : '';
    const status = (profile.status || '').toLowerCase();  // ✅ NEW line

    return (
      name.includes(keyword) ||
      job.includes(keyword) ||
      native.includes(keyword) ||
      location.includes(keyword) ||
      age.includes(keyword) ||
      status.includes(keyword) // ✅ NEW condition
    );
  });
};

  /* ---------- RENDERERS ---------- */
const renderReceived = ({ item }) => (
  <TouchableOpacity onPress={() => openProfile(item)} activeOpacity={0.9}>
    <View style={styles.card}>
      <View style={styles.profilePicContainer}>
        <Image source={{ uri: item.profilePic }} style={styles.profilePic} />

        {/* Dot and "Online" text in one line with green background */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 14,
            right: 145,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            if (item.lastSeen === 'online') {
              setSelectedOnlineId(item.id);
              setTimeout(() => {
                setSelectedOnlineId(null);
              }, 2000);
            }
          }}
        >
          {item.lastSeen === 'online' ? (
            <>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'green',
                  marginRight: 26,
                }}
              />
              {selectedOnlineId === item.id && (
                <Text
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    fontSize: 12,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  Online
                </Text>
              )}
            </>
          ) : (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: 'gray',
                 marginRight: 26,
              }}
            />
          )}
        </TouchableOpacity>

        {/* Premium & Verified */}
        {item.premium && (
          <View style={styles.badgePremium}>
            <Text style={styles.badgeIcon}>⭐</Text>
          </View>
        )}
        {item.verified && (
          <View style={styles.badgeVerified}>
            <Text style={{ color: '#ffffff', fontSize: 16 }}>✔</Text>
          </View>
        )}

        {/* Match bar */}
        <View style={styles.matchBadgeContainer}>
          <View style={[styles.matchBadgeBar, { width: `${item.matchPercent}%` }]} />
          <Text style={styles.matchBadgeLabel}>✨{item.matchPercent}%</Text>
        </View>
      </View>

      <Text style={styles.profileName}>  {item.name}</Text>
      <Text style={styles.cardSubTextLine}>   {item.age} yrs • {item.location}</Text>
      <Text style={styles.cardSubTextJob}>  💼 {item.job}</Text>

      <View style={styles.tagRow}>
        <Text style={styles.tag}>Kind</Text>
        <Text style={styles.tag}>Music Lover</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingTop: 6 }}>
        <Text style={styles.lastSeenText}>🕒 {item.lastSeen}</Text>
      </View>

      {item.status === 'Pending' ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.likeButton, { backgroundColor: '#e0e0e0', cursor: 'pointer' }]}
            onPress={() => handleResponse(item.id, 'Declined')}
          >
            <Text style={styles.likeButtonText}>✖  Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.passButton, { backgroundColor: '#F44336', cursor: 'pointer' }]}
            onPress={() => handleResponse(item.id, 'Accepted')}
          >
            <Text style={styles.btnText}>🤍 Like</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text
          style={[
            styles.status,
            { color: item.status === 'Declined' ? 'red' : 'green' },
          ]}
        >
          {item.status}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);



const renderSent = ({ item }) => (
  <TouchableOpacity onPress={() => openProfile(item)} activeOpacity={0.9}>
    <View style={styles.Ccard}>
      <View style={styles.profilePicContainer}>
        <Image source={{ uri: item.profilePic }} style={styles.profilePic} />

        {/* ✅ Dot and "Online" text in one line with green background */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 14,
            right: 145,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            if (item.lastSeen === 'online') {
              setSelectedOnlineId(item.id);
              setTimeout(() => {
                setSelectedOnlineId(null);
              }, 2000);
            }
          }}
        >
          {item.lastSeen === 'online' ? (
            <>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'green',
                  marginRight: 26,
                }}
              />
              {selectedOnlineId === item.id && (
                <Text
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    fontSize: 12,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  Online
                </Text>
              )}
            </>
          ) : (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: 'gray',
                marginRight: 26,
              }}
            />
          )}
        </TouchableOpacity>
 
        {item.verified && (
          <View style={styles.badgeVerified}>
            <Text style={{ color: '#ffffff', fontSize: 16 }}>✔</Text>
          </View>
        )}
        {item.premium && (
          <View style={styles.badgePremium}>
            <Text style={styles.badgeIcon}>⭐</Text>
          </View>
        )}
        <View style={styles.matchBadgeContainer}>
  <View style={[styles.matchBadgeBar, { width: `${item.matchPercent}%` }]} />
  <Text style={styles.matchBadgeLabel}>✨{item.matchPercent}%</Text>
</View>

      </View>

<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
  <Text style={[styles.profileName, { flexShrink: 1 }]} numberOfLines={1}>
    {item.name}
  </Text>

  {(item.status === 'Pending' || item.status === 'Declined') && (
    <View
      style={{
        backgroundColor: item.status === 'Declined' ? '#F44336' : '#FF9800',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
         marginTop: 60,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
        {item.status}
      </Text>
    </View>
  )}
</View>
      
      <Text style={styles.cardSubTextLine}>   {item.age} yrs • {item.location}</Text>
      <Text style={styles.cardSubTextJob}>  💼 {item.job}</Text>

      <View style={styles.tagRow}>
        <Text style={styles.tag}>Kind</Text>
        <Text style={styles.tag}>Music Lover</Text>
      </View>
<View style={{ paddingLeft: 10, paddingTop: 6 }}>
  <Text style={styles.lastSeenText}>🕒 {item.lastSeen}</Text>
</View>
    </View>
  </TouchableOpacity>
);

 const renderMatch = ({ item }) => {
  const meet = meetingRecords[item.id];

  return (
    <TouchableOpacity onPress={() => openProfile(item)} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.profilePicContainer}>
          <Image source={{ uri: item.profilePic }} style={styles.profilePic} />

          {/* ✅ Dot and Online text logic */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 14,
              right: 145,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              if (item.lastSeen === 'online') {
                setSelectedOnlineId(item.id);
                setTimeout(() => {
                  setSelectedOnlineId(null);
                }, 2000);
              }
            }}
          >
            {item.lastSeen === 'online' ? (
              <>
                {selectedOnlineId === item.id ? (
                  <Text
                    style={{
                      backgroundColor: 'green',
                      color: 'white',
                      fontSize: 12,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    Online
                  </Text>
                ) : (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'green',
                      marginRight: 26,
                    }}
                  />
                )}
              </>
            ) : (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'gray',
                  marginRight: 26,
                }}
              />
            )}
          </TouchableOpacity>

          {/* Verified & Premium */}
          {item.verified && (
            <View style={styles.badgeVerified}>
              <Text style={{ color: '#ffffff', fontSize: 16 }}>✔</Text>
            </View>
          )}
          {item.premium && (
            <View style={styles.badgePremium}>
              <Text style={styles.badgeIcon}>⭐</Text>
            </View>
          )}

          {/* Match % */}
          <View style={styles.matchBadgeContainer}>
            <View style={[styles.matchBadgeBar, { width: `${item.matchPercent}%` }]} />
            <Text style={styles.matchBadgeLabel}>✨{item.matchPercent}%</Text>
          </View>
        </View>

        {/* Name + Details */}
        <Text style={styles.profileName}>  {item.name}</Text>
        <Text style={styles.cardSubTextLine}>   {item.age} yrs • {item.location}</Text>
        <Text style={styles.cardSubTextJob}>  💼 {item.job}</Text>

        {/* Tags */}
        <View style={styles.tagRow}>
          <Text style={styles.tag}>Kind</Text>
          <Text style={styles.tag}>Music Lover</Text>
        </View>

        {/* Last seen + Icons */}
        <View style={styles.lastSeenRow}>
          <Text style={styles.lastSeenText}> 🕒 {item.lastSeen}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 2 }}>
            <TouchableOpacity onPress={() => handleCall(item.phone)} title="Call">
              <Text style={[styles.icon, { marginRight: 4 }]}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMessage(item.phone)} title="Message">
              <Text style={styles.icon}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meet Button */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: '#f15c5d', cursor: 'pointer' },
            ]}
            onPress={() => openMeeting(item)}
          >
            <Text style={styles.btnText}>📅 Meet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  /* ---------- SELECT LIST & RENDERER ---------- */
 const listData =
  activeTab === 'received'
    ? filterProfiles(receivedList.filter(p => p.status !== 'Accepted'))
    : activeTab === 'sent'
    ? filterProfiles(getFilteredSent())
    : filterProfiles(matches);


  const listRenderer =
    activeTab === 'received'
      ? renderReceived
      : activeTab === 'sent'
      ? renderSent
      : renderMatch;

  /* ---------- UI ---------- */
  return (
    <View style={styles.container}>
     
      {/* Tabs */}
     <View style={styles.tabRow}>
  {['received', 'sent', 'matches'].map(k => {
    const count =
      k === 'received'
        ? receivedList.filter(p => p.status !== 'Accepted').length
        : k === 'sent'
        ? sentList.filter(p => p.status !== 'Accepted').length
        : matches.length;

    const label =
      k === 'received' ? ' Newinterest' :
      k === 'sent'     ? ' Sent' :
                         ' Matches';

    return (
      <TouchableOpacity
        key={k}
        style={[
          styles.tab,
          activeTab === k ? styles.activeTab : styles.inactiveTab,
        ]}
        onPress={() => setActiveTab(k)}
      >
        <View style={styles.tabWithBadge}>
          <Text
            style={[
              styles.tabText,
              activeTab === k ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            {label}
          </Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  })}
</View>
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 12,
  }}
>
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '50%',
      backgroundColor: '#fff5f5',
      borderRadius: 10,
      paddingHorizontal: 8,
      borderColor: '#f7c6c8',
      borderWidth: 1,
    }}
  >
    {/* Move icon inside box */}
    <Text style={{ fontSize: 16, color: '#999', marginRight: 4 }}>🔍</Text>
    <TextInput
      placeholder="Search..."
      placeholderTextColor="#999"
      value={searchText}
      onChangeText={setSearchText}
      style={{
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
      }}
    />
  </View>
</View>


      {/* List */}
   <FlatList
  data={filterProfiles(listData)}
  keyExtractor={item => item.id}
  renderItem={listRenderer}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: 'space-between' }}
  ListEmptyComponent={
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
      }}
    >
      <Text style={styles.noData}>No profiles found</Text>
     
    </View>
  }
  contentContainerStyle={{
    paddingHorizontal: 4,
    paddingBottom: 24,
    minHeight: '70%', // keep background fill full height
    backgroundColor: '#FDECECf5',
  }}
/>

    {/* ----- Profile Modal ----- */}
<Modal visible={profileModal} animationType="slide">
  <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
    {/* Header */}
    <View style={styles.profileHeaderRow}>
      <Text style={styles.headerText}>Personal Details</Text>
      <TouchableOpacity onPress={() => setProfileModal(false)}>
        <Text style={styles.closeIcon}>✖</Text>
      </TouchableOpacity>
    </View>

    {/* Profile Picture */}
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: selectedProfile?.profilePic }}
        style={styles.largeSquarePic}
      />

      {/* Verified badge */}
      {selectedProfile?.verified && (
        <View style={styles.badgeVerified}>
              <Text style={{ color: '#ffffff', fontSize: 16 }}>✔</Text>
            </View>

      )}

      {/* Premium badge */}
      {selectedProfile?.premium && (
        <View style={styles.badgePremium}>
              <Text style={styles.badgeIcon}>⭐</Text>
            </View>

      )}
    </View>

    {/* Profile Details */}        
<Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Name:</Text> {selectedProfile?.name}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Age:</Text> {selectedProfile?.age}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Job:</Text> {selectedProfile?.job}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Location:</Text> {selectedProfile?.location}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Salary:</Text> {selectedProfile?.salary}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Education:</Text> {selectedProfile?.education}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Family Type:</Text> {selectedProfile?.familyType}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Caste:</Text> {selectedProfile?.caste}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Religion:</Text> {selectedProfile?.religion}
  </Text>
  <Text style={styles.profileViewText}>
    <Text style={styles.profileViewBold}>      Phone:</Text> {selectedProfile?.phone}
  </Text> 
  </ScrollView>
</Modal>



      {/* ----- Meeting FULL-SCREEN modal ----- */}
      <Modal
  visible={meetingModal}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setMeetingModal(false)}
>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalBackdrop}>
  <View style={styles.popupContainer}>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={[styles.name, { textAlign: 'center', marginBottom: 6 }]}>
        Schedule with {meetingProfile?.name}
      </Text>

      {/* Date */}
      <TouchableOpacity
        style={styles.datePickerBtn}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>
          {meetingDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={meetingDate}
          mode="date"
          display={Platform.OS === 'android' ? 'spinner' : 'default'}
          minimumDate={today}
          onChange={(_, d) => {
            setShowDatePicker(false);
            if (d && d >= today) setMeetingDate(d);
          }}
        />
      )}

      {/* Time */}
      <Text style={[styles.textBody, { marginTop: 12, fontWeight: '600' }]}>
        Time
      </Text>
      <View style={styles.timeRow}>
        <Picker selectedValue={hour} style={styles.picker} onValueChange={setHour}>
          {Array.from({ length: 13 }, (_, i) => (
            <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
          ))}
        </Picker>

        <Text style={{ fontSize: 22, marginHorizontal: 4 }}>:</Text>

        <Picker selectedValue={minute} style={styles.picker} onValueChange={setMinute}>
          {Array.from({ length: 60 }, (_, i) => (
            <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')} />
          ))}
        </Picker>

        <Picker selectedValue={period} style={styles.picker} onValueChange={setPeriod}>
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>

      {/* Location */}
      <Text style={[styles.textBody, { marginTop: 12, fontWeight: '600' }]}>
        Meeting place
      </Text>
      <TextInput
        placeholder="Enter meeting place"
        value={place}
        onChangeText={setPlace}
        style={styles.placeInput}
      />

      {/* Save & Cancel buttons */}
      <View style={styles.meetingBottomBar}>
        <TouchableOpacity
          style={[styles.meetingBtn, { backgroundColor: '#F44336' }]}
          onPress={() => setMeetingModal(false)}
        >
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.meetingBtn, { backgroundColor: '#f15c5d' }]}
          onPress={saveMeeting}
        >
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
</View>


        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  /* Layout */
  container: {
    flex: 1,
    padding:0,
    backgroundColor: PALETTE.bgScreen,
  },

  /* Tabs */
  
  
  tabRow:{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 , marginTop: 6, marginRight: 6, marginLeft: 6,gap:9},
  
  tab:{
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 88,
    alignItems: 'not center',
    elevation: 2,
  },
  activeTab:   { backgroundColor: PALETTE.tabActiveBg },
  inactiveTab: { backgroundColor: PALETTE.tabInactiveBg },
  tabText:        { fontWeight: '700', fontSize: 20 },
  tabTextActive:   { color: PALETTE.tabActiveText },
  tabTextInactive: { color: PALETTE.tabInactiveText },
  
  

  /* Filters */
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 88,
    alignItems: 'center',
    elevation: 2,
  },
  activeFilter:   { backgroundColor: PALETTE.filterActive },
  inactiveFilter: { backgroundColor: PALETTE.filterInactive },
  filterText: { fontSize: 13, color: '#000000', fontWeight: '700' },

  /* Cards */
 /* CARD SIZE + LAYOUT UPDATE TO MATCH IMAGE */
card: {
  width: 196,
  height:380,
  backgroundColor: PALETTE.bgCard,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: PALETTE.borderCard,
  margin: 4,
  padding: 0,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 0,
},
Ccard: {
  width: 196,
  height:340,
  backgroundColor: PALETTE.bgCard,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: PALETTE.borderCard,
  margin: 4,
  padding: 0,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 0,
},
profilePic: {
  width: '100%',
  height: 180,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  resizeMode: 'cover',
},

tagRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 5,
},

btnRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 27,
  gap: 3,
},

actionBtn:{
  backgroundColor: '#f15c5d',       // coral red
  paddingVertical: 10,
  paddingHorizontal:70,
  borderRadius: 8,
  alignSelf: 'center',              // ✅ centers inside card
  marginTop: 10,
  marginBottom: 10,
},

actionBtnFull: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  gap: 0,
  allignment:'center',
},

btnText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 14,
},

tagRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 10,
  gap: 0,
},

tag: {
  backgroundColor: '#f3e5f5',
  color: '#9c27b0',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  fontSize: 12,
  fontWeight: '600',
   marginLeft: 7,
  marginTop: 1,
},
timeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 9,
  gap: 6,
},

picker: {
  flex: 1,
  height: 48,
  backgroundColor: '#f7f7f7',
  borderRadius: 8,
},
datePickerBtn: {
  borderWidth: 1,
  borderColor: PALETTE.borderCard,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 20,
  marginTop: 12,
  alignItems: 'center',
  backgroundColor: '#f7f7f7',
},
datePickerText: {
  textAlign: 'center',
  color: PALETTE.textBody,
  fontWeight: '600',
  fontSize: 15,
},
meetingBottomBar: {
  flexDirection: 'row',
  padding: 16,
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderColor: '#eee',
  justifyContent: 'space-between',
  gap: 10,
},

meetingBtn: {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  elevation: 2,
},
 profileHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: '#fef2f2', // very light coral red background
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f7c6c8',
  },

 largePicContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#f15c5d',
    marginBottom: 12,
  },

  profilePicLarge: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
profileName: {
  fontSize: 18,
  fontWeight: '700',
  color: '	#000000',
  marginTop: 60,
},

profileSubtext: {
  fontSize: 14,
  color: '#666',
  marginTop: 3,
},

profileCard: {
  backgroundColor: '#fff',
  margin: 20,
  padding: 20,
  borderRadius: 16,
  borderColor: PALETTE.borderCard,
  borderWidth: 1,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
},

profileInfo: {
  fontSize: 15,
  color: PALETTE.textBody,
  marginBottom: 10,
  lineHeight: 22,
},

bold: {
  fontWeight: '700',
  color: '#333',
},
profilePicContainer: {
  position: 'relative',
  width: '100%',
  height: 120,
},

iconBadge: {
  position: 'absolute',
  top: 6,
  left: 6,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  paddingHorizontal: 4,
  paddingVertical: 2,
  elevation: 2,
},
profilePicContainer: {
  position: 'relative',
},

iconBadge: {
 backgroundColor: '#FFFFFF',
  width: 20,
  height: 20,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 6,
  borderWidth: 1,
  borderColor: '#ccc',
  elevation: 2,
},
profilePicContainer: {
  position: 'relative',
  width: '100%',
  height: 120,
},

iconBadge: {
 backgroundColor: '#fff',
  width: 20,
  height: 20,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 6,
  borderWidth: 1,
  borderColor: '#ccc',
  elevation: 2,
},

largePicContainer: {
  position: 'relative',
  alignItems: 'center',
},

profilePicLarge: {
  width: 130,
  height: 130,
  borderRadius: 65,
  resizeMode: 'cover',
},
badgeCircle: {
  backgroundColor: '#fff',
  width: 20,
  height: 20,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 6,
  borderWidth: 1,
  borderColor: '#ccc',
  elevation: 2,
},
badgeText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#f15c5d',
},
badgeOnline: {
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: '#28a745',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 12,
  zIndex: 2,
},
badgeOnlineText: {
  fontSize: 14,
  color: '#fff',
  fontWeight: 'bold',
},

badgeVerified: {
  position: 'absolute',
  top: 8,
  left: 105,
  backgroundColor: '#3b82f6',
  padding: 3,
  borderRadius: 20,
  zIndex: 2,
  position: 'absolute',
  top: 6,
  right: 6,
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#007bff', // or any blue you want
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},
badgePremium: {
  position: 'absolute',
  top: 8,
  left: 130,  
  padding: 1,
  borderRadius: 18,
  zIndex: 1,
  position: 'absolute',
  top: 6,
  right: 8,
  width: 24,
  height: 24,
  borderRadius: 12,
},
badgeIcon: {
  fontSize: 16,
  color: '#007bff',
  fontWeight: 'bold',
},
badgeMatch: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: '#28a745',
  paddingHorizontal: 5,
  paddingVertical: 2,
  borderRadius: 12,
},
badgeMatchText: {
  fontSize: 14,
  color: 'rgba(0,0,0,0.4)',
  fontWeight: 'bold',
},
lastSeenText: {
  fontSize: 14,
  color: '#888',
  marginTop: 16,
  marginBottom: 5,
  fontFamily: 'YourCustomFont-Regular', // Optional: use your font here
},
onlineBadge: {
  position: 'absolute',
  top: 6,
  left: 6,
  backgroundColor: '#28a745',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 20,
  zIndex: 3,
  elevation: 3,
},

onlineBadgeText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
lastSeenRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // or 'space-between' if you want icons pushed to the end
  marginTop: 10,
  gap: 20, // if gap doesn't work, use marginLeft on icons instead
},

lastSeenText: {
  fontSize: 16,
  color: '#888',
},

icon: {
 backgroundColor: '#FFFFFF',
  width: 20,
  height: 20,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 6,
  borderWidth: 1,
  borderColor: '#ccc',
  elevation: 2,// add spacing between text and icons
   position: 'absolute',
  top: 6,
  right: 6,
  width: 24,
  height: 24,
  borderRadius: 12,
},
meetButton: {
  backgroundColor: '#f15c5d',
  paddingVertical: 8,
  paddingHorizontal: 40,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 6,
  width: '100%',
  alignSelf: 'center',
},
lastSeenRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 12,
  gap:34,
},

lastSeenText: {
  fontSize: 16,
  color: '#888',
  marginRight:27,
},

iconCircle: {
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: '#e0e0e0', // or any light gray or accent
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 0,
   position: 'absolute',
  top: 6,
  right: 6,
  width: 24,
  height: 24,
  borderRadius: 12,
},

icon: {
  fontSize: 14,
   backgroundColor: '#FFFFFF',
   
},
cardSubTextLine: {
  fontSize: 12,
  color: '#444444',
  fontFamily: 'System', // Replace with 'YourCustomFont-Regular' if you have it
  marginBottom: 8,
  paddingleft: 23,
},

cardSubTextJob: {
  fontSize: 14,
  color: '#444444',
  fontWeight: '600',
  fontFamily: 'System', // Replace with 'YourCustomFont-Bold' if needed
},
buttonRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  gap: 8,
  marginTop: 20,
},

likeButton: {
  backgroundColor: '#f15c5d',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 8,
  alignItems: 'center',
},

likeButtonText: {
  color: '#444444',
  fontSize: 14,
},

passButton: {
  backgroundColor: '#e0e0e0',
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderRadius: 8,
  alignItems: 'center',
},

passButtonText: {
  color: '#000000',
  fontSize: 14,
},
meetButton: {
  backgroundColor: '#f15c5d',
  paddingVertical: 6,
  paddingHorizontal: 70,      // controls button width
  borderRadius: 20,
  alignSelf: 0,        // ⬅️ centers inside the card
  marginTop: 10,
  marginBottom: 6,
  minWidth: 88,              // ⬅️ optional fixed size to look balanced
},

meetButtonText: {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
},
cardContent: {
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center', // optional
},
tabHeader: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: '#ffffff',
  paddingVertical: 10,
},

tabButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f4f4f4',
  borderRadius: 20,
  paddingHorizontal: 10,
  paddingVertical: 6,
},

tabButtonActive: {
  backgroundColor: '#6A60F6',
},

tabText: {
  fontSize: 14,
  fontWeight: 'bold',
  marginRight: 6,
},

tabTextActive: {
  color: '#ffffff',
},

tabTextInactive: {
  color: '#444444',
},

tabBadge: {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  paddingHorizontal: 6,
  paddingVertical: 2,
},

tabBadgeText: {
  color: '#6A60F6',
  fontSize: 12,
  fontWeight: 'bold',
},
modalBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},
popupContainer: {
  width: '95%',
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 10,
  maxHeight: '95%',
  elevation: 10,
},
btnRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  paddingHorizontal: 16, // Equal spacing left and right
  marginTop: 12,
},
actionBtn: {
  backgroundColor: '#f15c5d',
  paddingVertical: 10,
  paddingHorizontal: 50,
  borderRadius: 10,
  alignItems: 'center',
  alignSelf: 'center',
},
tabWithBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  margin: 0,
},

tabText: {
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
  padding: 0,
  margin: 0,
},

tabTextActive: {
  color: '#ffffff',
},

tabTextInactive: {
  color: '#444444',
},

countBadge: {
  marginLeft: 2,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#ffffff',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 0,
},

countBadgeText: {
  color: '#000',
  fontSize: 11,
  fontWeight: 'bold',
  textAlign: 'center',
  textAlignVertical: 'center',
  includeFontPadding: false,
  padding: 0,
  margin: 0,
},
icon: {
  fontSize: 16,
  color: '#444', // Optional styling
},

  /* ---------- ATTRACTIVE PROFILE VIEW ---------- */
  profileViewHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: '#fef2f2',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f7c6c8',
  },

  profileViewImageContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#f15c5d',
    marginBottom: 12,
  },

  profileViewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },

  profileViewBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#f15c5d',
  },

  profileViewName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f15c5d',
    marginTop: 6,
    textAlign: 'center',
  },

  profileViewSubText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
    marginTop: 4,
    textAlign: 'center',
  },

  profileViewCard: {
    backgroundColor: '#fff',
    margin: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f7c6c8',
  },

  profileViewText: {
    fontSize: 15,
    marginBottom: 8,
    color: '#444',
  },

  profileViewBold: {
    fontWeight: '600',
    color: '#f15c5d',
  },

  profileViewCloseButton: {
    backgroundColor: '#f15c5d',
    marginHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },

  profileViewCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
  alignItems: 'center',
  backgroundColor: '#fff5f5',
  marginBottom: 16,
},

largeSquarePic: {
  width: '80%',
  height: '80%',
  resizeMode: 'cover',
},

iconBadge: {
  position: 'absolute',
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderWidth: 1,
  borderColor: '#ddd',
},
profileHeaderRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  backgroundColor: '#fff',
},
headerText: {
  fontSize: 20,
  color: '#f15c5d',
  fontWeight: 'bold',
},
closeIcon: {
  fontSize: 22,
  color: '#f15c5d',
},
profileHeader: {
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 10,
},
largeSquarePic: {
  width: 360,
  height: 290,
  borderRadius: 12,
  resizeMode: 'cover',
},
iconBadge: {
  position: 'absolute',
  backgroundColor: '#fff',
  padding: 5,
  borderRadius: 20,
  elevation: 3,
},
matchBadgeContainer: {
  position: 'absolute',
  top: 8,
  right: 1,
  backgroundColor:'#e6f4ea', // light pink background like original badge
  paddingHorizontal: 0,
  paddingVertical: 2,
  borderRadius: 10,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
},

matchBadgeBar: {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  backgroundColor: '#4CAF50', // coral red
  borderRadius: 10,
},

matchBadgeLabel: {
  fontSize: 12,
  color: '#000000',
  fontWeight: '500',
  zIndex: 1,
},
noData: {
  fontSize: 24,
  fontWeight: '600',
  color: '#999',
  textAlign: 'center',
  marginTop: 0,
},
statusDotOnline: {
  width: 20,
  height: 20,
  borderRadius: 20,
  backgroundColor: '#00C853', // green dot for online
  marginLeft: 6,
   position: 'absolute',
  top: 8,
  left: 6,
  backgroundColor: '#28a745',
 
},

statusDotOffline: {
  width: 20,
  height: 20,
  borderRadius: 20,
  backgroundColor: '#BDBDBD', // grey dot for offline
  marginLeft: 6,
   position: 'absolute',
  top: 8,
  left: 6,
 
},
});