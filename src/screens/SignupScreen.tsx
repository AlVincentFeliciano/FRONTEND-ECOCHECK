// /ecocheck-app/src/screens/SignupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import client from '../api/client';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { storeToken } from '../utils/auth';

// After signup, you might want to navigate to Login or Home
type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      console.log('📩 Sending registration request:', { email, password });

      const response = await client.post('/auth/register', { email, password });

      const { token } = response.data;
      console.log('✅ Registration response:', response.data);

      // Optionally auto-login by storing token
      await storeToken(token);

      Alert.alert('Success', 'Registration successful! You can now log in.');
      navigation.navigate('Login');

    } catch (error: unknown) {
      console.error('❌ Registration error:', error);

      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.msg ||
          error.response?.data?.error ||
          'An error occurred during registration.';
        Alert.alert('Error', msg);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />
      <View style={{ marginTop: 10 }}>
        <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default SignupScreen;
