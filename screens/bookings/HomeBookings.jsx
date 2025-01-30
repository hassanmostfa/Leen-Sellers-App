import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeBookingCard from '../../components/bookings/HomeBookingCard';

const HomeBookings = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Accepted'); // Tracks the current active tab
  const [bookingsData, setBookingsData] = useState({
    Accepted: [],
    Pending: [],
    Rejected: [],
  });
  const [loading, setLoading] = useState(false);

  // Function to fetch data from the APIs
  const fetchBookings = async (category) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken'); // Retrieve token from AsyncStorage
      const headers = {
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
      };
      let response;
      if (category === 'Accepted') {
        response = await fetch('https://leen-app.com/public/api/seller/homeBookings', { headers });
      } else if (category === 'Pending') {
        response = await fetch('https://leen-app.com/public/api/seller/homeBookings/newRequests', { headers });
      } else if (category === 'Rejected') {
        response = await fetch('https://leen-app.com/public/api/seller/homeBookings/rejectedRequests', { headers });
      }
      const data = await response.json();

      // Reverse the data before setting it to ensure the latest record appears first
      const reversedBookings = data.data ? [...data.data].reverse() : [];
      
      setBookingsData((prevData) => ({
        ...prevData,
        [category]: reversedBookings,
      }));
    } catch (error) {
      console.error(`Failed to fetch ${category} bookings:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings when activeTab changes
  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>
            <Icon name="arrow-left" size={24} color="#000000" /> {/* Left arrow for back */}
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الحجوزات المنزلية</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['Accepted', 'Pending', 'Rejected'].map((category, index) => {
          const categoryArabic = category === 'Accepted' ? 'المقبولة' : category === 'Pending' ? 'الجديدة' : 'المرفوضة';
          return (
            <TouchableOpacity
              key={index}
              style={[styles.tab, activeTab === category && styles.activeTab]}
              onPress={() => setActiveTab(category)}
            >
              <Text style={[styles.tabText, activeTab === category && styles.activeTabText]}>
                {categoryArabic}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings List */}
      <View style={styles.bookingsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#f08b47" />
        ) : (
          <FlatList
            data={bookingsData[activeTab]} // Render the reversed data
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <HomeBookingCard navigation={navigation} item={item} />}
            ListEmptyComponent={<Text style={styles.emptyText}>لا توجد حجوزات متاحة.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row-reverse', // Changed this to row-reverse
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#435E58',
  },
  tabText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  activeTabText: {
    color: '#435E58',
    fontFamily: 'AlmaraiBold',
  },
  bookingsContainer: {
    flex: 1,
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeBookings;
