import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,  // Import ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCard from '../../components/media/ImageCard';
import axios from 'axios';

const Gallery = ({ navigation }) => {
  const [images, setImages] = useState([]); // Gallery images
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Image selected from device
  const [description, setDescription] = useState(''); // Description for optional input

  // Fetch initial images from the server
  const fetchImages = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://leen-app.com/public/api/seller/images', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setImages(data.data || []);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch images');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle image selection
  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You must allow the app to access your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
    console.log('selectedImage:', result.assets[0]);
    
  };

  const handleSubmitImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'You must select an image to upload.');
      return;
    }
  
    try {
      const authToken = await AsyncStorage.getItem('authToken');
  
      // Create FormData
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri, // The file URI from selectedImage
        name: selectedImage.fileName || 'image.jpg', // The file name
        type: selectedImage.mimeType || 'image/jpeg', // The file MIME type
      });
  
      formData.append('description', description || ''); // The description
  
      // Make the POST request with Axios
      const response = await axios.post('https://leen-app.com/public/api/seller/images/upload', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });
  
      if (response.status === 200) {
        Alert.alert('Success', 'Image uploaded successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Gallery') },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to upload image');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Alert.alert('Error', 'Server error occurred. Please try again later.');
      } else if (error.message === 'Network request failed') {
        Alert.alert('Error', 'Network request failed. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An error occurred while uploading the image: ' + error.message);
      }
    }
  
    // Reset the selected image and description
    setSelectedImage(null);
    setDescription('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Gallery */}
      {loading ? (
        <ActivityIndicator size="large" color="#2f3e3b" style={styles.loader} /> // Show ActivityIndicator while loading
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => <ImageCard navigation={navigation} item={item} />}
        />
      )}

      {/* Add Image Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Image</Text>
            {/* Image Picker */}
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
              ) : (
                <Icon name="image-plus" size={50} color="#aaa" />
              )}
            </TouchableOpacity>

            {/* Description Input */}
            <TextInput
              style={styles.input}
              placeholder="Image Description (Optional)"
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
                onPress={handleSubmitImage}
              >
                <Text style={styles.buttonText}>Add</Text>
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
    backgroundColor: '#f8f9fa', // Light gray background for contrast
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
    width: '90%',
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
    height: 300,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#aaa',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
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
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#ff5c5c',
  },
  submitButton: {
    backgroundColor: '#2f3e3b',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Gallery;
