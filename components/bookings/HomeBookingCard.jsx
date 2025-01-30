import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CalendarImg from '../../assets/images/avatars/calendar2.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Function to format time
const formatTime = (timeString) => {
  const time = new Date(`1970-01-01T${timeString}`);
  return new Intl.DateTimeFormat('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(time);
};

const HomeBookingCard = ({ item, navigation }) => {
  const [loading, setLoading] = useState(false);

  // Handle marking a service as done
  const handleServiceDone = async (id) => {
    setLoading(true);

    try {
      const authToken = await AsyncStorage.getItem('authToken');

      const response = await axios.put(
        `https://leen-app.com/public/api/seller/homeBookings/serviceIsDone/${id}`,
        {}, // No request body needed
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setLoading(false);
      Alert.alert('نجاح', 'تم إنهاء الخدمة بنجاح', [
        {
          text: 'حسنا',
          onPress: () => navigation.navigate('HomeBookings'),
        },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث حالة الحجز. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Image source={CalendarImg} style={styles.serviceImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardDetail}>رقم الحجز: {item.id}</Text>
        <Text style={styles.cardTitle}>{item.home_service.name}</Text>
        <Text style={styles.cardDetail}>
          اسم العميل: {item.customer.first_name + ' ' + item.customer.last_name}
        </Text>
        <Text style={styles.cardDetail}>وقت البداية: {formatTime(item.start_time)}</Text>
        <Text style={styles.cardDetail}>التاريخ: {item.date}</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        {/* Navigate to ShowHomeBooking */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ShowHomeBooking', { item })}
          style={styles.eyeIconButton}
        >
          <Icon name="eye" size={24} color="#2f3e3b" />
        </TouchableOpacity>
        <Text style={styles.eyeButtonText}>التفاصيل</Text>

        {item.booking_status === 'accepted' && (
          <View>
            <TouchableOpacity
              onPress={() => handleServiceDone(item.id)}
              style={styles.eyeIconButton}
              disabled={loading} // Disable button during API call
            >
              {loading ? (
                <ActivityIndicator size="small" color="#f08b47" />
              ) : (
                <Icon name="check" size={24} color="#f08b47" />
              )}
            </TouchableOpacity>
            <Text style={styles.eyeButtonText}>تمت</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderRightWidth: 7,
    borderRightColor: '#435E58',
  },
  serviceImage: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
    marginRight: 5,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
    color: '#454545',
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'AlmaraiRegular',
    marginBottom: 5,
  },
  eyeIconButton: {
    marginLeft: 20,
    backgroundColor: '#f5f5f5',
    padding: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  eyeButtonText: {
    marginTop: 5,
    color: '#435E58',
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'AlmaraiRegular',
  },
});

export default HomeBookingCard;
