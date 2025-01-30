import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const UpdateCoupon = ({ route, navigation }) => {
  // Get coupon data from the route params
  const { item } = route.params;

  // Set state to hold the updated coupon data
  const [code, setCode] = useState(item.code);
  const [discountValue, setDiscountValue] = useState(item.discount_value.toString());
  const [expiresAt, setExpiresAt] = useState(new Date(item.expires_at));
  const [usageLimit, setUsageLimit] = useState(item.usage_limit.toString());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle coupon update
  const handleUpdateCoupon = async () => {
    if (!code || !discountValue || !usageLimit) {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول.');
      return;
    }

    const token = await AsyncStorage.getItem('authToken');
    const couponData = {
      code,
      discount_value: parseInt(discountValue, 10),
      expires_at: expiresAt.toISOString().split('T')[0],
      usage_limit: parseInt(usageLimit, 10),
    };

    try {
      const response = await fetch(`https://leen-app.com/public/api/seller/coupons/update/${item.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      if (response.ok) {
        Alert.alert('نجاح', 'تم تحديث الكوبون بنجاح.', [
          { text: 'حسناً', onPress: () => navigation.navigate('Coupons') },
        ]);
      } else {
        Alert.alert('خطأ', 'حدث خطأ أثناء تحديث الكوبون.');
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر الاتصال بالخادم.');
    }
  };

  // Handle date change from the DateTimePicker
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expiresAt;
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
    setExpiresAt(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تعديل الكوبون</Text>

      <TextInput
        style={styles.input}
        placeholder="الكود"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="الخصم (%)"
        keyboardType="numeric"
        value={discountValue}
        onChangeText={setDiscountValue}
      />

      {/* Date Picker */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {expiresAt ? expiresAt.toISOString().split('T')[0] : 'تاريخ الانتهاء'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={expiresAt}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="حد الاستخدام"
        keyboardType="numeric"
        value={usageLimit}
        onChangeText={setUsageLimit}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateCoupon}>
        <Text style={styles.buttonText}>تحديث الكوبون</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#2f3e3b',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateCoupon;
