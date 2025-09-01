// /ecocheck-app/src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { removeToken } from '../utils/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await removeToken();
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AJ</Text>
          </View>
          <Text style={styles.name}>Alex Johnson</Text>
          <Text style={styles.bio}>Passionate environmental advocate.</Text>

          {/* ✅ Updated Edit Profile button with navigation */}
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 40, // extra top padding for spacing from status bar
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginVertical: 15 
  },
  card: {
    backgroundColor: '#43a047',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    backgroundColor: '#3949ab',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  name: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 5 
  },
  bio: { 
    fontSize: 14, 
    color: '#f1f1f1', 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  editButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e53935',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default ProfileScreen;
