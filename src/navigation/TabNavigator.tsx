// /ecocheck-app/src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabParamList = {
  HomeTab: undefined;
  ReportsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false, // hides the top header on all tabs
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ReportsTab" component={ReportsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
