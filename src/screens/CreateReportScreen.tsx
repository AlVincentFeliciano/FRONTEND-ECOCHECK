import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { createReport } from '../api/reports';
import axios from 'axios';

const CreateReportScreen = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!hasCameraPermission) {
      Alert.alert('Camera permission denied');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    if (!hasLocationPermission) {
      Alert.alert('Location permission denied');
      return;
    }

    try {
      const locationData = await Location.getCurrentPositionAsync({});
      setCurrentLocation(locationData);

      const geocode = await Location.reverseGeocodeAsync({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });

      if (geocode.length > 0) {
        const addr = geocode[0];
        setLocation(`${addr.name || ''}, ${addr.city || ''}, ${addr.country || ''}`.trim());
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get location. Try again.');
    }
  };

  const handleSubmit = async () => {
    if (!photoUri || !currentLocation) {
      Alert.alert('Missing Info', 'Please take a photo and get your location.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('contact', contact);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('latitude', String(currentLocation.coords.latitude));
      formData.append('longitude', String(currentLocation.coords.longitude));
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      await createReport(formData);

      Alert.alert('Success', 'Report submitted!');
      setName('');
      setContact('');
      setDescription('');
      setLocation('');
      setPhotoUri(null);
      setCurrentLocation(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.error || 'An error occurred');
      } else {
        Alert.alert('Error', 'Unexpected error occurred');
      }
    }
  };

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (!hasCameraPermission) return <Text>No access to camera</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Report Waste</Text>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Contact" value={contact} onChangeText={setContact} />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Get My Location</Text>
        </TouchableOpacity>
        {location ? <Text style={styles.locationText}>Location: {location}</Text> : null}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f7' },
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, width: '100%' },
  locationText: { marginTop: 10, marginBottom: 10, fontStyle: 'italic' },
  imagePreview: { width: '100%', height: 200, resizeMode: 'contain', marginVertical: 10 },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CreateReportScreen;
