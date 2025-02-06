import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmpImg from '../../assets/images/avatars/man.png';

const Employees = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  // Fetch employees function
  const fetchEmployees = async () => {
    setLoading(true); // Set loading state to true
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('خطأ', 'لم يتم العثور على رمز التوثيق');
        setLoading(false);
        return;
      }

      const response = await fetch('https://leen-app.com/public/api/seller/employees', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data.data || []); 
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تحميل قائمة الموظفين');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.employeeItem}>
              <View style={styles.imageContainer}>
                <Image 
                  source={EmpImg} 
                  style={styles.profileImage} 
                />
              </View>
              <View style={styles.employeeDetails}>
                <Text style={styles.employeeName}>{item.name}</Text>
                <Text style={styles.employeePosition}>{item.position}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({
  container: {
    direction: 'rtl',
    paddingHorizontal: 15,
  },
  employeeItem: {
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F6F6F6',
    marginBottom: 10,
    alignItems: 'center',
    gap: 15,
  },
  imageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
  },
  employeeDetails: {
    flexDirection: 'column',
  },
  employeeName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'AlmaraiBold',
  },
  employeePosition: {
    fontSize: 16,
    color: '#777',
    fontFamily: 'AlmaraiRegular',
  },
});
