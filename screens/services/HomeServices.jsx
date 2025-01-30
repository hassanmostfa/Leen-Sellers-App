import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For accessing localStorage
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeServiceCard from '../../components/services/Home/HomeServiceCard';

const HomeServices = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        
        if (!authToken) {
          console.error('Auth token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('https://leen-app.com/public/api/seller/homeServices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setServices(data.data);
        } else {
          console.error('Failed to fetch services:', data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f08b47" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الخدمات المنزلية</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddHomeService')}>
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HomeServiceCard navigation={navigation} item={item} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا يوجد خدمات</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2f3e3b',
    padding: 15,
    marginTop: 20,
    direction: 'rtl',
  },
  headerTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomeServices;
