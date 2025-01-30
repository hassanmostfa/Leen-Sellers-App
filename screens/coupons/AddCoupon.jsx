import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AddCoupon = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [expiresAt, setExpiresAt] = useState(new Date());
  const [usageLimit, setUsageLimit] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiresAt(selectedDate);
    }
  };

  const handleSubmit = async () => { // Marked as async
    if (!code || !discountValue || !usageLimit) {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول.');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('authToken'); // await AsyncStorage.getItem
      console.log(token);
      
      const couponData = {
        code,
        discount_value: parseInt(discountValue, 10),
        expires_at: expiresAt.toISOString().split('T')[0],
        usage_limit: parseInt(usageLimit, 10),
      };
  
      console.log(couponData);
  
      const response = await fetch('https://leen-app.com/public/api/seller/coupons/store', { // await the fetch call
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });
  
      const data = await response.json(); // Get the response data
  
      if (response.ok) {
        Alert.alert('نجاح', 'تم إضافة الكوبون بنجاح.', [{ text: 'حسناً', onPress: () => navigation.navigate('Coupons') }]);
      } else {
        Alert.alert('خطأ', `حدث خطأ أثناء إضافة الكوبون: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر الاتصال بالخادم.');
      console.error(error); // Log the error for debugging
    }
  };
  

  return (
    <View>
         {/* Header */}
         <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="arrow-left" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>اضافة كوبون</Text>
              </View>

    <View style={styles.container}>
               
      <TextInput
        style={styles.input}
        placeholder="رمز الكوبون"
        placeholderTextColor="#999"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="نسبة الخصم"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={discountValue}
        onChangeText={setDiscountValue}
      />
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>تاريخ الانتهاء: {expiresAt.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={expiresAt}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="حد الاستخدام"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={usageLimit}
        onChangeText={setUsageLimit}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>إضافة</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  dateButton: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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

export default AddCoupon;
