import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmployeeAvatar from '../assets/images/avatars/man.png';

const HomeEmployees = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Retrieve token from AsyncStorage
  
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
      setEmployees(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Render Individual Employee Card
  const renderEmployeeCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={EmployeeAvatar}
          style={styles.image}
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.position}>{item.position}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Employees')} >
          <Text style={styles.viewAll}>عرض الكل</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>الموظفين</Text>
      </View>

      {/* Employee List */}
      <FlatList
        data={employees}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderEmployeeCard}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f3e3b',
  },
  viewAll: {
    fontSize: 14,
    color: '#007bff',
  },
  list: {
    paddingHorizontal: 5,
    direction: 'rtl',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 130,
    marginRight: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e3b',
  },
  position: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeEmployees;
