import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const About = ({ first_name, last_name, location }) => {
  const [loading, setLoading] = useState(true);
  const [timetables, setTimetables] = useState([]);

  // Fetch timetables function
  const fetchTimetables = async () => {
    setLoading(true); // Set loading state to true
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      // If no token found, show an alert and return
      if (!token) {
        Alert.alert('خطأ', 'لم يتم العثور على رمز التوثيق');
        setLoading(false);
        return;
      }

      // Fetch timetable data from the API
      const response = await fetch('https://leen-app.com/public/api/seller/timetables', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Check for response status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Update the state with the timetable data
      setTimetables(data.timetables || []); // Ensure default to empty array if no timetables found

    } catch (error) {
      // Show an alert in case of error
      Alert.alert('خطأ', 'فشل في تحميل جدول المواعيد');
      console.error('Error fetching timetables:', error);
    } finally {
      setLoading(false); // Set loading state to false once the process is done
    }
  };

  // Fetch timetables when the component mounts
  useEffect(() => {
    fetchTimetables();
  }, []);

  // Function to translate days to Arabic
  const translateDayToArabic = (day) => {
    const daysInArabic = {
      Sunday: 'الأحد',
      Monday: 'الإثنين',
      Tuesday: 'الثلاثاء',
      Wednesday: 'الأربعاء',
      Thursday: 'الخميس',
      Friday: 'الجمعة',
      Saturday: 'السبت',
    };
    return daysInArabic[day] || day; // Default to the English day if not found
  };

  // Function to format time without seconds (e.g., 10:00 AM) and handle timezone issue
  const formatTime = (time) => {
    const timeParts = time.split(':'); // Split time into [hours, minutes]
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];

    // Get local time by adding hours to the current date
    const localTime = new Date();
    localTime.setHours(hours);
    localTime.setMinutes(minutes);

    // Format time to be displayed (HH:mm format)
    const options = { hour: '2-digit', minute: '2-digit' };
    return localTime.toLocaleTimeString([], options); // Returns time in the local timezone
  };

  return (
    <View style={styles.container}>
      {/* Seller Name */}
      <Text style={styles.name}>{first_name} {last_name}</Text>

      {/* Location with Icon */}
      <View style={styles.locationContainer}>
        <Icon name="map-marker-outline" size={20} color="#3D3D3D" />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      {/* Timetable Section */}
      <Text style={styles.timetableTitle}>مواعيد العمل</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={timetables}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.timetableItem}>
                <Icon name="circle" size={20} color="#76D44A" />
              <Text style={styles.timetableText}>
                {translateDayToArabic(item.day)} {/* Translates day to Arabic */}
              </Text>
              <Text style={styles.timetableText}>
                {`من  ${formatTime(item.start_time)}  إلى  ${formatTime(item.end_time)}`} {/* Formats time */}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 20,
    direction: 'rtl',
    width: '100%', // Make sure the container takes the full width
  },
  name: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    marginBottom: 5,
    marginRight: 7,
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 16,
    color: '#3D3D3D',
    marginLeft: 5,
    fontFamily: 'AlmaraiRegular',
  },
  timetableTitle: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    marginVertical: 20,
    marginRight: 7,
  },
  timetableItem: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure each item takes full width
    gap: 10,
  },
  timetableText: {
    fontSize: 16,
    color: '#3D3D3D',
    fontFamily: 'AlmaraiRegular',
    flex: 1, // Ensures the text uses available space within the row
  },
});
