import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { removeToken, getToken } from '../utils/auth';
import client from '../api/client';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { jwtDecode } from 'jwt-decode';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface DecodedToken {
  user: { id: string };
  exp: number;
}

interface User {
  name: string;
  email: string;
  bio?: string;
  profilePic?: string | null;
  points?: number; // ✅ Added points
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.user.id;

      const res = await client.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData: User = res.data?.data;
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('❌ Fetch user error:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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

        {user && (
          <View style={styles.card}>
            <View style={styles.avatar}>
              {user.profilePic ? (
                <Image
                  source={{ uri: user.profilePic }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>{user.name?.charAt(0) || 'U'}</Text>
              )}
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.bio}>{user.bio || user.email}</Text>

            {/* ✅ Display points */}
            <Text style={styles.points}>Points: {user.points || 0}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f7' },
  container: { flex: 1, alignItems: 'center', padding: 20, paddingTop: 40 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 15 },
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
    overflow: 'hidden',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  profileImage: { width: 70, height: 70, borderRadius: 35 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  bio: { fontSize: 14, color: '#f1f1f1', marginBottom: 5, textAlign: 'center' },
  points: { fontSize: 16, color: '#fff', fontWeight: 'bold', marginBottom: 15 },
  editButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  editButtonText: { color: '#333', fontWeight: 'bold' },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e53935',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ProfileScreen;
