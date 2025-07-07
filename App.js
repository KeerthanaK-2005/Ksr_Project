// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing all main page screens
import HoroscopeScreen from './pages/HoroscopeScreen';
import MatchesScreen from './pages/MatchesScreen';
import AdUploadScreen from './pages/AdUploadScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Horoscope">
        <Stack.Screen
          name="Horoscope"
          component={HoroscopeScreen}
        />
        <Stack.Screen
          name="Matches"
          component={MatchesScreen}
        />
        <Stack.Screen
          name="Advertisement"
          component={AdUploadScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
