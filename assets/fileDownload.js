import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';

export async function saveTextToFile(filename, content) {
  try {
    // Save inside app's document directory (safe, no permission needed)
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
    await RNFS.writeFile(path, content, 'utf8');
    Alert.alert('Downloaded', `File saved`);
  } catch (err) {
    console.log('Save failed:', err);
    Alert.alert('Error', 'Failed to save file');
  }
}
