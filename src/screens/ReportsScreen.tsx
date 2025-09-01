// frontend/src/screens/ReportsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { getAllReports } from '../api/reports';

const ReportsScreen = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Reports</Text>
        {reports.length === 0 ? (
          <Text>No reports submitted yet.</Text>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.photo} />}
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Description:</Text> {item.description}
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Location:</Text> {item.location}
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Status:</Text> {item.status}
                </Text>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Reported On:</Text> {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            )}
          />
        )}
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default ReportsScreen;
