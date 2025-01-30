import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CouponCard from '../../components/CouponCard';
const Coupons = ({ navigation}) => {
  const [coupons, setCoupons] = useState([]); // Store coupons
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch coupons from API
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken'); // Retrieve token
      const response = await fetch('https://leen-app.com/public/api/seller/coupons', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCoupons(data.data|| []); // Store coupons
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);



  return (
    <View style={styles.container}>
        {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-left" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>قسائم الخصم (الكوبونات)</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddCoupon')}>
                  <Icon name="plus" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2f3e3b" style={styles.loader} />
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <CouponCard item={item} navigation={navigation} />}
          contentContainerStyle={styles.listContainer}
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 15,
    color: '#2f3e3b',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
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
});

export default Coupons;
