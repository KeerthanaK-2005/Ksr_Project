// components/MessageBubble.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from './Colors';

const MessageBubble = ({ item }) => {
  const isUser = item.sender === 'user';
  const timestamp = new Date(Number(item.id.split(/[a-z]/)[0])).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <View style={[styles.messageRow, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
      <Text style={styles.avatar}>{isUser ? '👩‍💻' : '🤖'}</Text>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 20,
    marginRight: 6,
  },
  bubble: {
    borderRadius: 14,
    padding: 10,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: Colors.userBubble,
  },
  botBubble: {
    backgroundColor: Colors.botBubble,
  },
  text: {
    color: Colors.text,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default MessageBubble;
