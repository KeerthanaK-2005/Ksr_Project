// screens/ProfileSetupScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, SafeAreaView,
  KeyboardAvoidingView, Platform
} from 'react-native';

import Colors from '../components/Colors';
import InputBar from '../components/InputBar';
import ModalPop from '../components/ModalPop';
import MessageBubble from '../components/MessageBubble';
import ProfileSummaryCard from '../components/ProfileSummaryCard';

export default function ProfileSetupScreen() {
  const [messages, setMessages] = useState([
    { id: Date.now().toString(), sender: 'bot', text: 'Hi there! 👋 Tell me about yourself !' },
  ]);
  const [input, setInput] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showContinueChat, setShowContinueChat] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const extractProfile = (text) => {
    const extract = (pattern) => {
      try {
        const match = text.match(new RegExp(pattern, 'i'));
        return match?.[1]?.trim() || '-';
      } catch {
        return '-';
      }
    };
    return {
      name: extract("my name(?: is|'s)?\\s+([A-Za-z ]{2,})"),
      age: extract("i am (\\d{1,3}) years old"),
      dob: extract("born on ([A-Za-z0-9 ,/-]+)"),
      pob: extract("in ([A-Za-z ]+)[.\\s]*"),
      education: extract("studied ([A-Za-z0-9.\\s]+ at [A-Za-z0-9\\s]+)"),
      hobbies: extract("hobbies are ([\\w\\s,]+)"),
      father: extract("father(?:'s)? name is ([A-Za-z ]+)"),
      mother: extract("mother(?:'s)? name is ([A-Za-z ]+)"),
      religion: extract("i follow ([A-Za-z]+)"),
      blood: extract("blood group is ([A-Za-z0-9+\\-]+)"),
    };
  };

  const showProfileSummary = (data) => {
    const summaryArray = [
      { label: 'Name', value: data.name },
      { label: 'Age', value: data.age },
      { label: 'Date of Birth', value: data.dob },
      { label: 'Place of Birth', value: data.pob },
      { label: 'Education', value: data.education },
      { label: 'Hobbies', value: data.hobbies },
      { label: "Father's Name", value: data.father },
      { label: "Mother's Name", value: data.mother },
      { label: 'Religion', value: data.religion },
      { label: 'Blood Group', value: data.blood },
    ];

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 'a',
          sender: 'bot',
          type: 'profileSummaryWithHeader',
          data: summaryArray,
          editPrompt: profileSaved ? '' : 'Do you want to edit anything in your profile? 😊',
        }
      ]);
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    setInput('');
    const newMessage = { id: Date.now().toString(), sender: 'user', text: userInput };
    setMessages(prev => [...prev, newMessage]);

    if (isEditing && userInput.includes(':')) {
      const updates = userInput.split('\n');
      const newProfile = { ...profileData };
      updates.forEach(line => {
        const [keyRaw, valueRaw] = line.split(':');
        if (keyRaw && valueRaw) {
          const key = keyRaw.trim().toLowerCase();
          const value = valueRaw.trim();
          switch (key) {
            case 'name': newProfile.name = value; break;
            case 'age': newProfile.age = value; break;
            case 'dob':
            case 'date of birth': newProfile.dob = value; break;
            case 'pob':
            case 'place of birth': newProfile.pob = value; break;
            case 'education': newProfile.education = value; break;
            case 'hobbies': newProfile.hobbies = value; break;
            case 'father': case "father's name": newProfile.father = value; break;
            case 'mother': case "mother's name": newProfile.mother = value; break;
            case 'religion': newProfile.religion = value; break;
            case 'blood': case 'blood group': newProfile.blood = value; break;
            default: break;
          }
        }
      });
      setProfileData(newProfile);
      setIsEditing(false);
      showProfileSummary(newProfile);
      return;
    }

    if (!profileSaved && !isEditing) {
      const data = extractProfile(userInput);
      setProfileData(data);
      showProfileSummary(data);
    }
  };

  const handleEditChoice = () => {
    setMessages(prev => prev.filter(m => m.type !== 'profileSummaryWithHeader'));

    const formattedText = `Name: ${profileData.name}\nAge: ${profileData.age}\nDate of Birth: ${profileData.dob}\nPlace of Birth: ${profileData.pob}\nEducation: ${profileData.education}\nHobbies: ${profileData.hobbies}\nFather's Name: ${profileData.father}\nMother's Name: ${profileData.mother}\nReligion: ${profileData.religion}\nBlood Group: ${profileData.blood}`;

    setInput(formattedText);
    setIsEditing(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), sender: 'bot', text: '🔃 Profile loaded in input field. Edit and send when ready!' },
      ]);
    }, 100);
  };

  const handleSubmitProfile = () => {
    setProfileSaved(true);
    setShowModal(true);
    setIsEditing(false);
    setShowContinueChat(true);
  };

  const renderItem = ({ item }) => {
    if (item.id === 'continueChat') {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <Text style={{ fontSize: 20, marginRight: 6 }}>🤖</Text>
          <View style={{
            backgroundColor: Colors.botBubble,
            borderRadius: 14,
            padding: 10,
            maxWidth: '85%',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2
          }}>
            <Text style={{ color: Colors.text, lineHeight: 22 }}>🎉 Your profile is set! You can keep chatting or update anytime. 😊</Text>
            <Text style={{ fontSize: 10, color: '#999', marginTop: 4, textAlign: 'right' }}>{timestamp}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'profileSummaryWithHeader') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <Text style={{ fontSize: 20, marginRight: 6 }}>🤖</Text>
          <ProfileSummaryCard
            data={item.data}
            summaryExpanded={summaryExpanded}
            setSummaryExpanded={setSummaryExpanded}
            profileSaved={profileSaved}
            onEdit={handleEditChoice}
            onSubmit={handleSubmitProfile}
          />
        </View>
      );
    }

    return <MessageBubble item={item} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{
        backgroundColor: Colors.primary,
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 40 : 60,
        paddingBottom: 14,
      }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>AI Profile Assistant</Text>
        <Text style={{ color: '#fff', fontSize: 13, marginTop: 2 }}>Profile Upload Helper</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={
            showContinueChat
              ? [...messages, { id: 'continueChat', sender: 'bot', text: 'Continue Chat' }]
              : messages
          }
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />
        <InputBar
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isEditing={isEditing}
        />
      </KeyboardAvoidingView>

      <ModalPop visible={showModal} onClose={() => setShowModal(false)} />
    </SafeAreaView>
  );
}
