import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import MainTabNavigator from './MainTabNavigator';
import LandingScreen from '../screens/LandingScreen';
import { navigationRef } from './RootNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import ViewProfileScreen from '../screens/ViewProfileScreen';
import EventDetailsScreen from '../components/EventDetailsScreen';
import EventPaymentScreen from '../components/EventPaymentScreen';
import EventSuccessScreen from '../components/EventSuccessScreen';
import { TabBarVisibilityProvider } from './TabBarVisibilityContext';

const Stack = createStackNavigator();

const AppNavigatorContent = () => {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) return null; // or a loading spinner

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
            <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
            <Stack.Screen name="EventPaymentScreen" component={EventPaymentScreen} />
            <Stack.Screen name="EventSuccessScreen" component={EventSuccessScreen} />
          </>
        ) : (
          <Stack.Screen name="Landing" component={LandingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppNavigator = () => (
  <AuthProvider>
    <SafeAreaProvider>
      <TabBarVisibilityProvider>
        <AppNavigatorContent />
      </TabBarVisibilityProvider>
    </SafeAreaProvider>
  </AuthProvider>
);

export default AppNavigator; 