import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SuccessModal from '../../components/modals/Success';

const EditEmployee = ({ route }) => {
  const { employee } = route.params;
  const [name, setName] = useState(employee.name);
  const [position, setPosition] = useState(employee.position);
  const [status, setStatus] = useState(employee.status === 'active');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const toggleStatus = () => setStatus((prev) => !prev);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        `https://leen-app.com/public/api/seller/employees/update/${employee.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            position,
            status: status ? 'active' : 'inactive',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsModalVisible(true); // Show modal on success
    } catch (error) {
      Alert.alert('خطأ', error.message);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.navigate('Employees');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تعديل بيانات الموظف</Text>
      </View>

      {/* Form Inputs */}
      <View style={styles.contentContainer}>
        <Text style={styles.label}>
          اسم الموظف <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="اسم الموظف"
        />

        <Text style={styles.label}>
          الوظيفة <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={position}
          onChangeText={setPosition}
          placeholder="الوظيفة"
        />

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{status ? 'نشط' : 'غير نشط'}</Text>
          <Switch value={status} onValueChange={toggleStatus} />
          <Text style={styles.statusLabel}>الحالة:</Text>
        </View>
      </View>

      {/* Button at Bottom of Screen */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navigationButton} onPress={handleSave}>
          <Text style={styles.buttonText}>حفظ التغييرات</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={isModalVisible}
        message="تم تحديث بيانات الموظف بنجاح"
        buttonText="تم"
        onPress={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    direction: 'rtl',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign: 'right',
    fontFamily: 'AlmaraiBold',
  },
  requiredAsterisk: {
    color: 'red',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'AlmaraiBold',
  },
  statusText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'AlmaraiBold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
  },
  navigationButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
});

export default EditEmployee;
