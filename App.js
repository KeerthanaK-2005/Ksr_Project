import React from 'react';
import { SafeAreaView } from 'react-native';
import MatchesScreen from './pages/MatchesScreen';


export default function App() {
  return (
    <SafeAreaView style={{ flex: 1,padding: 10,
    paddingTop:50,
    backgroundColor: '#fff', }}>
      <MatchesScreen />
    </SafeAreaView>
  );  
}