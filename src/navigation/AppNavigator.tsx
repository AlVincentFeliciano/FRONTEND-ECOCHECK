import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import CreateReportScreen from '../screens/CreateReportScreen';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  CreateReport: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="CreateReport" component={CreateReportScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
