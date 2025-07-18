// components/ProfileSummaryCard.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from './Colors';

const ProfileSummaryCard = ({
  data,
  summaryExpanded,
  setSummaryExpanded,
  profileSaved,
  onEdit,
  onSubmit
}) => {
  return (
    <View style={[styles.bubble, styles.botBubble, styles.card]}>
      <Text style={styles.summaryHeader}>Profile Summary</Text>

      <TouchableOpacity onPress={() => setSummaryExpanded(!summaryExpanded)}>
        <Text style={styles.toggleBtn}>
          {summaryExpanded ? 'Hide ▲' : 'Show ▼'}
        </Text>
      </TouchableOpacity>

      {summaryExpanded && data.map((entry, index) => (
        <View key={index}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{entry.label}</Text>
            <Text style={styles.summaryValue}>{entry.value}</Text>
          </View>
          <View style={styles.divider} />
        </View>
      ))}

      {!profileSaved && summaryExpanded && (
        <View style={styles.summaryButtons}>
          <TouchableOpacity onPress={onEdit} style={styles.button}>
            <Text style={styles.buttonText}>Edit 📝</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 14,
    padding: 10,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  botBubble: { backgroundColor: Colors.botBubble },
  summaryHeader: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
    fontWeight: 'bold',
  },
  toggleBtn: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  summaryLabel: {
    width: '45%',
    color: Colors.labelText,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    width: '50%',
    color: Colors.valueText,
    fontSize: 14,
    textAlign: 'right',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 4,
    opacity: 0.5,
  },
  summaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
});

export default ProfileSummaryCard;
