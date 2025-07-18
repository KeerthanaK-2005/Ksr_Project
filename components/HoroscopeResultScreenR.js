 import React from 'react';
import { View, Text, StyleSheet, ScrollView,
         TouchableOpacity, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Toast from 'react-native-root-toast';   // ✅ tiny toast

export default function HoroscopeResultScreen({ route }) {
  const { result } = route.params || {};

  const makePdf = async () => {
    if (!result) return;

    const html = `
      <h1 style="color:#FF6F61">Your Horoscope</h1>
      <p><strong>Zodiac:</strong> ${result.zodiac || '-'}</p>
      <p><strong>Lucky Number:</strong> ${result.lucky_number || '-'}</p>
      <p><strong>Color:</strong> ${result.color || '-'}</p>
      <p><strong>Mood:</strong> ${result.mood || '-'}</p>
      <p><strong>Compatibility:</strong> ${result.compatibility || '-'}</p>
      <p>${result.description || ''}</p>
    `;

    try {
      const pdf = await RNHTMLtoPDF.convert({
        html,
        fileName: `horoscope_${Date.now()}`,
        base64: false,
      });

      // Share sheet
      await Share.open({
        url: `file://${pdf.filePath}`,
        type: 'application/pdf',
        title: 'Share or Save your Horoscope',
      });

      // Toast confirmation
      Toast.show('PDF saved! Check your share destination.', {
        duration: Toast.durations.SHORT,
      });
    } catch (err) {
      Alert.alert('PDF error', err.message);
    }
  };

  if (!result) {
    return (
      <View style={styles.center}>
        <Text>No data.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Horoscope</Text>

      <Row label="Zodiac"        value={result.zodiac} />
      <Row label="Lucky Number"  value={result.lucky_number} />
      <Row label="Color"         value={result.color} />
      <Row label="Mood"          value={result.mood} />
      <Row label="Compatibility" value={result.compatibility} />

      {result.description && (
        <Text style={styles.desc}>{result.description}</Text>
      )}

      <TouchableOpacity style={styles.pdfBtn} onPress={makePdf}>
        <Text style={{ color:'#fff', fontWeight:'bold' }}>Download PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* Helper component */
const Row = ({ label, value }) =>
  value ? (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  ) : null;

const styles = StyleSheet.create({
  container:{ flexGrow:1, padding:24, backgroundColor:'#fff' },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },
  title:{ fontSize:24, fontWeight:'bold', color:'#FF6F61', marginBottom:16 },
  row:{ flexDirection:'row', marginBottom:8 },
  label:{ width:120, fontWeight:'600' },
  value:{ flex:1 },
  desc:{ marginTop:16, fontStyle:'italic', color:'#444' },
  pdfBtn:{ marginTop:24, backgroundColor:'#FF6F61',
           padding:14, borderRadius:8, alignItems:'center' },
});
