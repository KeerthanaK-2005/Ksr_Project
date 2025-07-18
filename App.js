import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './components/LoginScreen';
import HoroscopeScreen from './pages/HoroscopeScreen';
import MatchesScreen from './pages/MatchesScreen1';
import AdUploadScreen from './pages/AdUploadScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} 
        />
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
