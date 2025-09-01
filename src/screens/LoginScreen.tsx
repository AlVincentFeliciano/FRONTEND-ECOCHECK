// /ecocheck-app/src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import client from '../api/client';
import axios from 'axios';
import { storeToken } from '../utils/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await client.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password
      });
      const { token } = response.data;

      await storeToken(token);

      Alert.alert('Success', 'Login successful!');
      navigation.replace('Main');

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.msg || 'Invalid credentials';
        Alert.alert('Error', msg);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <View style={{ marginTop: 10 }}>
        <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f4f7' },
  title: { fontSize: 28, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: '#fff' },
});

export default LoginScreen;
