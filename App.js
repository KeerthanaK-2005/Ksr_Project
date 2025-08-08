import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MatchesScreen from './src/screens/MatchesScreen';
import FilterScreen from './src/screens/FilterScreen';
import MatchSuccessScreen from './src/screens/MatchSuccessScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Matches" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Matches" component={MatchesScreen} />
        <Stack.Screen name="Filters" component={FilterScreen} />
        <Stack.Screen name="MatchSuccess" component={MatchSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
