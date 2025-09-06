import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import client from '../api/client';
import { getToken } from '../utils/auth';
import {jwtDecode} from 'jwt-decode';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface DecodedToken {
  user: { id: string };
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Fetch existing user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const decoded: DecodedToken = jwtDecode(token);
        const userId = decoded.user.id;

        const res = await client.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.data;
        if (userData) {
          setName(userData.name);
          setBio(userData.bio || '');
          setProfilePic(userData.profilePic || null);
        }
      } catch (err) {
        console.error('❌ Fetch user error:', err);
      }
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Not authenticated');
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.user.id;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);

      if (profilePic) {
        const filename = profilePic.split('/').pop() || 'photo.jpg';
        const ext = filename.split('.').pop()?.toLowerCase();
        const type = ext === 'png' ? 'image/png' : 'image/jpeg';

        formData.append('profilePic', {
          uri: profilePic,
          name: filename,
          type,
        } as any);
      }

      await client.put(`/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Profile Updated', 'Your profile information has been updated.');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>Choose Profile Picture</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#666',
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  saveButton: {
    backgroundColor: '#43a047',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default EditProfileScreen;
