import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, SafeAreaView, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { WebView } from 'react-native-webview';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TabParamList } from '../navigation/TabNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'HomeTab'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const wasteTopics = [
  {
    title: 'Recycle Paper & Cardboard',
    content: 'Always flatten cardboard boxes, remove staples, and recycle clean paper products.',
    image: require('../assets/paper.png'),
    extra: 'Did you know? Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
  },
  {
    title: 'Sort Plastics Correctly',
    content: 'Check recycling symbols and separate plastics by type to ensure proper processing.',
    image: require('../assets/plastic.png'),
    extra: 'Plastic bottles can take up to 450 years to decompose in landfills!',
  },
  {
    title: 'Compost Your Organics',
    content: 'Food scraps, garden waste, and organic matter can be composted to reduce landfill waste.',
    image: require('../assets/compost.png'),
    extra: 'Composting reduces methane emissions and creates nutrient-rich soil.',
  },
  {
    title: 'Handle E-Waste Safely',
    content: 'Electronics should be recycled at certified e-waste facilities to prevent harmful chemicals from leaking.',
    image: require('../assets/ewaste.png'),
    extra: 'E-waste contains valuable metals like gold, silver, and copper that can be reused.',
  },
];

// ✅ YouTube video links
const youtubeVideos = [
  "https://www.youtube.com/embed/BzQHLp2_4tU",
  "https://www.youtube.com/embed/6jQ7y_qQYUA",
  "https://www.youtube.com/embed/4sU9J3xXWqM",
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<typeof wasteTopics[0] | null>(null);

  const openModal = (topic: typeof wasteTopics[0]) => {
    setSelectedTopic(topic);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedTopic(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome To EcoCheck!</Text>
        <Text style={styles.subtitle}>You are successfully logged in.</Text>

        <TouchableOpacity style={styles.reportButton} onPress={() => navigation.navigate('CreateReport')}>
          <Text style={styles.reportButtonText}>Create a New Report</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Learn About Waste Segregation</Text>

        <View style={styles.cardsContainer}>
          {wasteTopics.map((topic, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{topic.title}</Text>
              <TouchableOpacity style={styles.readMoreButton} onPress={() => openModal(topic)}>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTopic?.title}</Text>
              {selectedTopic?.image && <Image source={selectedTopic.image} style={styles.modalImage} />}
              <Text style={styles.modalText}>{selectedTopic?.content}</Text>
              <Text style={styles.modalExtra}>{selectedTopic?.extra}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* ✅ Auto-sliding YouTube video carousel */}
        <Text style={styles.sectionTitle}>Useful Videos</Text>
        <View style={styles.carouselContainer}>
          <Swiper
            autoplay
            autoplayTimeout={6} // every 6 seconds
            loop
            showsPagination
            activeDotColor="#4caf50"
          >
            {youtubeVideos.map((videoUrl, idx) => (
              <View key={idx} style={styles.videoWrapper}>
                <WebView
                  source={{ uri: videoUrl }}
                  style={styles.video}
                  javaScriptEnabled
                  domStorageEnabled
                />
              </View>
            ))}
          </Swiper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  reportButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 15,
  },
  cardsContainer: {
    width: '100%',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  readMoreButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalExtra: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 20,
  },
  modalImage: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  carouselContainer: {
    height: 220,
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
});

export default HomeScreen;
