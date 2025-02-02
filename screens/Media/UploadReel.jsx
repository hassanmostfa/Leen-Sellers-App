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
import { Video } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SuccessModal from '../../components/modals/Success';
const UploadReel = ({ navigation }) => {
  const [videoUri, setVideoUri] = useState(null);
  const [description, setDescription] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false); // State to manage success modal visibility

  

      // Function to handle modal close and navigate back
      const handleSuccessModalClose = () => {
        setSuccessModalVisible(false); // Close the modal
        navigation.navigate('Reels'); // Navigate back after success
    };


  const openVideoPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const uploadVideo = async () => {
    if (!videoUri) {
      Alert.alert('خطأ', 'يرجى اختيار فيديو قبل التحميل.');
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
        setSuccessModalVisible(true);
        setVideoUri(null);
        setDescription('');
      } else {
        Alert.alert('خطأ', response.data.message || 'فشل تحميل الفيديو');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء التحميل');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
             <Text style={styles.headerTitle}>إضافة فيديو جديد</Text>
             <TouchableOpacity onPress={() => navigation.goBack()}>
               <Icon name="close" size={24} color="#000" />
             </TouchableOpacity>
           </View>
      <TouchableOpacity style={styles.dropZone} onPress={openVideoPicker}>
        {videoUri ? (
          <Video
            source={{ uri: videoUri }}
            style={styles.videoPreview}
            resizeMode="cover"
            useNativeControls
          />
        ) : (
          <View style={styles.placeholderContent}>
            <Feather name="upload" size={40} color="#56766F" />
            <Text style={styles.placeholderText}>اسحب الفيديو هنا أو اضغط لاختياره</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="أضف وصف (اختياري)"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={uploadVideo}>
        <Text style={styles.uploadButtonText}>تحميل</Text>
      </TouchableOpacity>

            {/* Success Modal */}
            <SuccessModal 
                visible={successModalVisible} 
                message="تمت إضافة الفيديو بنجاح!" 
                buttonText="مشاهدة الفيديو" 
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
  videoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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

export default UploadReel;
