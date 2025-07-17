import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TimePickerInput({ value, onChange }) {
  const [show, setShow] = useState(false);

  const formatTime = (date) => {
    if (!date) return 'Select birth time';
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const handleChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      const updated = new Date(selectedDate);
      updated.setSeconds(0); // 🔴 Default seconds to 00
      onChange(updated);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={[styles.inputText, !value && { color: '#999' }]}>
          {formatTime(value)}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date(2000, 0, 1, 0, 0, 0)}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    marginTop: 4,
  },
  inputText: { fontSize: 16 },
});
