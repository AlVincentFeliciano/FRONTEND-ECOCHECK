// /ecocheck-app/src/screens/EditProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  const [name, setName] = useState('Alex Johnson');
  const [bio, setBio] = useState('Passionate environmental advocate.');

  const handleSave = () => {
    // 🔹 Here you could update backend API or local storage
    Alert.alert('Profile Updated', 'Your profile information has been updated.');
    navigation.goBack(); // return to Profile screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

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
  saveButton: {
    backgroundColor: '#43a047',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default EditProfileScreen;
