import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker'; // For video picker
import ReelCard from '../../components/media/ReelCard'; // Assuming it's the video card component
import axios from 'axios';

const Reels = ({ navigation }) => {
  const [reels, setReels] = useState([]); // Gallery images
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility
  const [videoUri, setVideoUri] = useState(null); // Video URI
  const [description, setDescription] = useState(''); // Description for the video

  // Fetch initial images from the server
  const fetchReels = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://leen-app.com/public/api/seller/reels', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setReels(data.reels || []);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch videos');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Function to open the video picker
  const openVideoPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      allowsEditing: false,
    });
  
    // Check if the result contains video assets
    if (!result.canceled && result.assets) {
      const video = result.assets[0]; // Access the first selected video (if multiple selected)
      setVideoUri(video.uri); // Store the selected video URI
    }
  };
  

  // Function to upload the selected video to the API
  const uploadVideo = async () => {
    if (!videoUri) {
      Alert.alert('Error', 'Please select a video before uploading.');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('reel', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'video.mp4',
      });
      formData.append('description', description);

      const response = await axios.post(
        'https://leen-app.com/public/api/seller/reels/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Video uploaded successfully');
        setVideoUri(null); // Clear the video URI
        setDescription(''); // Clear description
        setModalVisible(false); // Close the modal
        fetchReels(); // Reload the reels
      } else {
        Alert.alert('Error', response.data.message || 'Failed to upload video');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during the upload');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الريلز</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Gallery */}
      {loading ? (
        <ActivityIndicator size="large" color="#2f3e3b" style={styles.loader} />
      ) : (
        <FlatList
          data={reels}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => <ReelCard navigation={navigation} item={item} />}
        />
      )}

      {/* Modal for uploading video */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload New Video</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={openVideoPicker}>
              <Text style={styles.imagePickerText}>
                {videoUri ? 'Change Video' : 'Select Video'}
              </Text>
            </TouchableOpacity>
            {videoUri && (
              <Text style={styles.previewText}>تم اختيار الفيديو بنجاح</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Add description (optional)"
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={uploadVideo}
              >
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2f3e3b',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  gallery: {
    paddingHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  imagePicker: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  imagePickerText: {
    color: '#333',
  },
  previewText: {
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: 'right',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Reels;
