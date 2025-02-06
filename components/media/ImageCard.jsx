import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageCard = ({ item , navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true); // Start loading state

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.delete(`https://leen-app.com/public/api/seller/images/destroy/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Image deleted successfully', [
            {
              text: 'حسنا',
              onPress: () => navigation.replace('Gallery'),
            }
          ]);
          
      } else {
        Alert.alert('Error', 'Failed to delete image');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the image: ' + error.message);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <View style={styles.imageContainer}>
      <ImageBackground source={{ uri: item.image }} style={styles.image}>
        {/* Delete Icon */}
        <TouchableOpacity onPress={handleDelete} style={styles.deleteIconContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="delete" size={24} color="#ff5c5c" />
          )}
        </TouchableOpacity>
      </ImageBackground>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 150,
    borderRadius: 12,
    justifyContent: 'flex-start',
  },
  description: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
    padding: 5,
  },
});

export default ImageCard;
