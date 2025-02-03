import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SuccessModal from '../../components/modals/Success';

const UploadImage = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Handle modal close and navigate back
  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('Gallery'); // Navigate back to gallery after success
  };

  // Open image picker
  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You must allow the app to access your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  // Upload image function
  const handleSubmitImage = async () => {
    if (!selectedImage) {
      Alert.alert('خطأ', 'يرجى اختيار صورة قبل التحميل.');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'image.jpg',
        type: selectedImage.mimeType || 'image/jpeg',
      });
      formData.append('description', description || '');

      const response = await axios.post(
        'https://leen-app.com/public/api/seller/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessModalVisible(true);
        setSelectedImage(null);
        setDescription('');
      } else {
        Alert.alert('خطأ', response.data.message || 'فشل تحميل الصورة');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء التحميل');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>إضافة صورة جديدة</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Image Picker */}
      <TouchableOpacity style={styles.dropZone} onPress={handleImagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholderContent}>
            <Feather name="image" size={40} color="#56766F" />
            <Text style={styles.placeholderText}>اسحب الصورة هنا أو اضغط لاختيارها</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholder="أضف وصف (اختياري)"
        value={description}
        onChangeText={setDescription}
      />

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleSubmitImage}>
        <Text style={styles.uploadButtonText}>تحميل</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        message="تمت إضافة الصورة بنجاح!"
        buttonText="مشاهدة الصور"
        onPress={handleSuccessModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row-reverse', // Title on the right, icon on the left
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  dropZone: {
    height: '70%',
    borderWidth: 2,
    borderColor: '#56766F',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    color: '#56766F',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 35,
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
  },
  uploadButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: 'AlmaraiBold',
    fontSize: 16,
  },
});

export default UploadImage;
