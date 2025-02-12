import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import avatar from '../assets/images/avatars/avatar03.jpg';
import { useNavigation } from '@react-navigation/native';
import TapNavigation from '../components/TapNavigation';
import Schedule from '../components/Schedule';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleType, setScheduleType] = useState('studio');
  const [studioBookings, setStudioBookings] = useState([]);
  const [homeBookings, setHomeBookings] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token not found');
        }

        const sellerInfoResponse = await fetch('https://leen-app.com/public/api/seller/info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!sellerInfoResponse.ok) {
          throw new Error('Failed to fetch seller info');
        }

        const sellerInfoResult = await sellerInfoResponse.json();
        setData(sellerInfoResult.data);

        const studioBookingsResponse = await fetch('https://leen-app.com/public/api/seller/studioBookings', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!studioBookingsResponse.ok) {
          throw new Error('Failed to fetch studio bookings');
        }

        const studioBookingsResult = await studioBookingsResponse.json();
        const formattedStudioBookings = studioBookingsResult.data.map((booking) => {
          const date = new Date(booking.date).toISOString().split('T')[0];
          const time = booking.start_time.split(':')[0].padStart(2, '0') + ':00';
          return {
            date,
            time,
            customerName: booking.customer?.first_name + ' ' + booking.customer?.last_name || 'Unknown Customer',
            employeeName: booking.employee?.name || 'Unknown Employee',
            serviceName: booking.studio_service?.name || 'Unknown Service',
          };
        });
        setStudioBookings(formattedStudioBookings);

        const homeBookingsResponse = await fetch('https://leen-app.com/public/api/seller/homeBookings', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!homeBookingsResponse.ok) {
          throw new Error('Failed to fetch home bookings');
        }

        const homeBookingsResult = await homeBookingsResponse.json();
        const formattedHomeBookings = homeBookingsResult.data.map((booking) => {
          const date = new Date(booking.date).toISOString().split('T')[0];
          const time = booking.start_time.split(':')[0].padStart(2, '0') + ':00';
          return {
            date,
            time,
            customerName: booking.customer?.first_name + ' ' + booking.customer?.last_name || 'Unknown Customer',
            employeeName: booking.employee?.name || 'Unknown Employee',
            serviceName: booking.home_service?.name || 'Unknown Service',
          };
        });
        setHomeBookings(formattedHomeBookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#435E58" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barstyle="light-content" />

      <View style={styles.mainSection}>
        <Image
          source={{ uri: data?.seller_logo || avatar }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>مرحبًا,</Text>
          <Text style={styles.name}>{data?.first_name + ' ' + data?.last_name}!</Text>
        </View>

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell-outline" size={30} color="#435E58" />
          <Text style={styles.iconText}>الاشعارات</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleLinks}>
        <TouchableOpacity
          style={[
            styles.scheduleLink,
            scheduleType === 'studio' && styles.activeScheduleLink,
          ]}
          onPress={() => setScheduleType('studio')}
        >
          <Text
            style={[
              styles.scheduleLinkText,
              scheduleType === 'studio' && styles.activeScheduleLinkText,
            ]}
          >
            حجوزات المقر
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.scheduleLink,
            scheduleType === 'home' && styles.activeScheduleLink,
          ]}
          onPress={() => setScheduleType('home')}
        >
          <Text
            style={[
              styles.scheduleLinkText,
              scheduleType === 'home' && styles.activeScheduleLinkText,
            ]}
          >
            حجوزات المنزل
          </Text>
        </TouchableOpacity>
      </View>

      {scheduleType === 'studio' ? (
        <Schedule bookings={studioBookings} />
      ) : (
        <Schedule bookings={homeBookings} />
      )}

      <TapNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'AlmaraiRegular',
  },
  mainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 25,
    direction: 'rtl',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 35,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'AlmaraiRegular',
  },
  name: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'AlmaraiBold',
  },
  iconWrapper: {
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 12,
    color: '#2f3e3b',
    marginTop: 5,
    fontFamily: 'AlmaraiRegular',
  },
  scheduleLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e7e7e7',
  },
  scheduleLink: {
    padding: 10,
    borderRadius: 5,
  },
  activeScheduleLink: {
    backgroundColor: '#435E58',
  },
  scheduleLinkText: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#435E58',
  },
  activeScheduleLinkText: {
    color: '#fff',
  },
});

export default Home;