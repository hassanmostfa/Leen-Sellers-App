import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReelCard from '../../components/media/ReelCard';
const Videos = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos from the API
  const fetchVideos = async () => {
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
        setVideos(data.reels || []);
      } else {
        Alert.alert('خطأ', data.message || 'فشل في جلب الفيديوهات');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#2f3e3b" style={styles.loader} />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.gallery}
          renderItem={({ item }) => <ReelCard navigation={navigation} item={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default Videos;
