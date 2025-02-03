import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCard from '../../components/media/ImageCard';

const Gallery = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('UploadImage')}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2f3e3b" style={styles.loader} />
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => <ImageCard navigation={navigation} item={item} />}
        />
      )}
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
});

export default Gallery;
