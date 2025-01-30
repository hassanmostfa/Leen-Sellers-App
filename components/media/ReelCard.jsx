import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ReelCard = ({ item, navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true); // Start loading state

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.delete(`https://leen-app.com/public/api/seller/reels/destroy/${item.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Reel deleted successfully', [
          {
            text: 'حسنا',
            onPress: () => navigation.replace('Reels'),
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to delete reel');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the reel: ' + error.message);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Video Playback using expo-av */}
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item.reel }}
          style={styles.video}
          shouldPlay
          useNativeControls
          resizeMode="cover"
        />
        {/* Delete Icon */}
        <TouchableOpacity onPress={handleDelete} style={styles.deleteIconContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="delete" size={24} color="#ff5c5c" />
          )}
        </TouchableOpacity>
      </View>
      {item.description && <Text style={styles.description}>{item.description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 15,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  videoContainer: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  video: {
    width:170,
    height: '100%',
    borderRadius: 16,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
});

export default ReelCard;
