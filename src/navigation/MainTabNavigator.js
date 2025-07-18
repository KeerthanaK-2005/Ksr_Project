import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, runOnUI, useDerivedValue } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { TabBarVisibilityContext } from './TabBarVisibilityContext';

// Screens
import SuccessStoriesScreen from '../screens/SuccessStoriesScreen';
import FilterScreen from '../screens/FilterScreen';
import ProfileUpdateScreen from '../screens/ProfileUpdateScreen';
import InterestsScreen from '../screens/InterestsScreen';
import HomeScreen from '../screens/HomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const TAB_ITEM_PADDING_HORIZONTAL = 15;

const tabs = [
  { name: 'Stories', labelKey: 'stories', component: SuccessStoriesScreen, icon: 'heart' },
  { name: 'Interests', labelKey: 'interests', component: InterestsScreen, icon: 'star' },
  { name: 'Home', labelKey: 'home', component: HomeScreen, icon: 'home' },
  { name: 'Matches', labelKey: 'matches', component: MatchesScreen, icon: 'people' },
  { name: 'Filter', labelKey: 'filter', component: FilterScreen, icon: 'filter' },
  { name: 'Profile', labelKey: 'profile', component: ProfileUpdateScreen, icon: 'person-circle' },
];

const AnimatedTabBar = ({ state, navigation }) => {
  const { t } = useTranslation();
  const [tabLayouts, setTabLayouts] = useState([]);
  
  const onTabLayout = (event, index) => {
    const { width, x } = event.nativeEvent.layout;
    setTabLayouts(prev => {
      const newLayouts = [...prev];
      newLayouts[index] = { width, x };
      return newLayouts;
    });
  };

  const xOffset = useSharedValue(0);
  const tabWidth = useSharedValue(0);
  const { isTabBarVisible } = React.useContext(TabBarVisibilityContext);
  const translateY = useSharedValue(0);
  React.useEffect(() => {
    translateY.value = isTabBarVisible ? withTiming(0, { duration: 350 }) : withTiming(140, { duration: 350 });
  }, [isTabBarVisible]);
  const hideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useDerivedValue(() => {
    if (tabLayouts.length === tabs.length && tabLayouts.every(l => l)) {
      const activeLayout = tabLayouts[state.index];
      if (activeLayout) {
        xOffset.value = withTiming(activeLayout.x, { duration: 350 });
        tabWidth.value = withTiming(activeLayout.width, { duration: 350 });
      }
    }
  }, [state.index, tabLayouts]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xOffset.value }],
      width: tabWidth.value,
    };
  });

  return (
    <Animated.View style={[styles.tabBarContainer, { overflow: 'hidden' }, hideStyle]}>
      <Animated.View style={[styles.activeTabBackground, animatedStyle]} />
      {state.routes.map((route, index) => {
        const tabInfo = tabs.find(ti => ti.name === route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLayout={(event) => onTabLayout(event, index)}
            style={styles.tabItem}
          >
            {isFocused ? (
              <View style={styles.activeTabPill}>
                <Icon
                  name={tabInfo.icon}
                  size={22}
                  color={COLORS.neutral}
                />
                <Text style={styles.tabLabel}>{typeof t(tabInfo.labelKey) === 'string' ? t(tabInfo.labelKey).toLowerCase() : ''}</Text>
              </View>
            ) : (
              <Icon
                name={`${tabInfo.icon}-outline`}
                size={22}
                color={'gray'}
                style={{ alignSelf: 'center' }}
              />
            )}
          </Pressable>
        );
      })}
    </Animated.View>
  );
};

const MainTabNavigator = () => {
  const navigation = useNavigation();
  const { initialTab, setInitialTab } = useContext(AuthContext);

  return (
    <Tab.Navigator
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {tabs.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 90 : 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 1,
  },
  activeTabBackground: {
    position: 'absolute',
    height: '70%',
    top: '15%',
    left: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    zIndex: 0,
  },
  activeTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 7,
    alignSelf: 'center',
  },
  tabLabel: {
    marginLeft: 8,
    color: COLORS.neutral,
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'lowercase',
  },
});

export default MainTabNavigator; 