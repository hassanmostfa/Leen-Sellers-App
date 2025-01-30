import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultEmployeeImage = require('../../assets/images/avatars/man.png');

const Employees = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });
  const [loading, setLoading] = useState(true);

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
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
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete employee
  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        `https://leen-app.com/public/api/seller/employees/destroy/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        Alert.alert('نجاح', 'تم حذف الموظف بنجاح');
        setEmployees(employees.filter((employee) => employee.id !== id)); // Remove from UI
      } else {
        Alert.alert('خطأ', 'لم يتم حذف الموظف');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء الحذف');
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد أنك تريد حذف الموظف؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', onPress: () => handleDelete(id) },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الموظفون</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddEmployee')}
          >
            <View style={styles.addIconContainer}>
              <Icon name="plus" size={24} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Employee List */}
      {loading ? (
        <ActivityIndicator size="large" color="#2f3e3b" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={defaultEmployeeImage} // Default employee image
                style={styles.cardImage}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardPosition}>{item.position}</Text>
              </View>

              <View style={styles.cardStatus}>
                <Text style={styles.cardStatusText}>
                  {item.status === 'active' ? 'نشط' : 'غير نشط'}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditEmployee', { employee: item })}
                  style={styles.iconButton}
                >
                  <Icon name="pencil" size={22} color="#435E58" />
                  <Text style={styles.actionLabel}>تعديل</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(item.id)}
                >
                  <Icon name="trash-can" size={22} color="#f44336" />
                  <Text style={styles.actionLabel}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'transparent',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  headerTitle: {
    color: '#000000',
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginLeft: 15,
  },
  addIconContainer: {
    backgroundColor: '#435E58',
    borderRadius: 50,
    padding: 8,
  },
  backButton: {
    marginLeft: 5,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    borderRightWidth: 7,
    borderRightColor: '#435E58',
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'AlmaraiBold',
  },
  cardPosition: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'AlmaraiRegular',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  deleteButton: {
    marginHorizontal: 15,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#435E58',
    marginTop: 5,
    fontFamily: 'AlmaraiRegular',
  },
  cardStatus: {
    backgroundColor: '#435E58',
    padding: 5,
    borderRadius: 8,
    marginLeft: 40,
  },
  cardStatusText: {
    color: '#fff',
    fontFamily: 'AlmaraiRegular',
  },
});

export default Employees;
