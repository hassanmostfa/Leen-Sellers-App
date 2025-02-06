import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCard from '../../components/media/ImageCard';
const Images = ({ navigation}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get auth token
  const getAuthToken = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      return authToken;
    } catch (error) {
      console.error('Error retrieving auth token', error);
      return null;
    }
  };

  // Fetch images from API
  const fetchImages = async () => {
    const authToken = await getAuthToken(); // Get auth token

    if (!authToken) {
      console.error('Auth token is missing');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://leen-app.com/public/api/seller/images', {
        headers: {
          'Authorization': `Bearer ${authToken}`, // Send auth token
        },
      });

      const data = await response.json();
      console.log('Fetched images:', data.data);  // Log to inspect the data structure
      setImages(data.data); // Assuming the response contains an array of image URLs under 'data' field
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Get the screen width for 3 images per row
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={images}
          numColumns={3} // Set 3 images per row
          keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
          renderItem={({ item }) => <ImageCard navigation={navigation} item={item} />}
          contentContainerStyle={styles.gallery}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gallery: {
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  image: {
    width: (Dimensions.get('window').width - 40) / 3, // Calculate width for 3 images per row
    height: 120, // Fixed height for each image
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Images;
