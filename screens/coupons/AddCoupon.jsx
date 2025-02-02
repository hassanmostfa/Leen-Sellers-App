import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessModal from '../../components/modals/Success';
const AddCoupon = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [expiresAt, setExpiresAt] = useState(new Date());
  const [usageLimit, setUsageLimit] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false); // State to manage success modal visibility
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiresAt(selectedDate);
    }
  };


      // Function to handle modal close and navigate back
      const handleSuccessModalClose = () => {
        setSuccessModalVisible(false); // Close the modal
        navigation.goBack(); // Navigate back after success
    };


  const handleSubmit = async () => {
    if (!code || !discountValue || !usageLimit) {
      Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');

      const couponData = {
        code,
        discount_value: parseInt(discountValue, 10),
        expires_at: expiresAt.toISOString().split('T')[0],
        usage_limit: parseInt(usageLimit, 10),
      };

      const response = await fetch('https://leen-app.com/public/api/seller/coupons/store', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success modal and reset Coupon data
        setSuccessModalVisible(true);
      } else {
        Alert.alert('خطأ', `حدث خطأ أثناء إضافة الكوبون: ${data.message}`);
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر الاتصال بالخادم.');
      console.error(error);
    }
  };


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>إضافة كوبون جديد</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.label}>رمز الكوبون <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="مثال: ABC123"
          placeholderTextColor="#999"
          value={code}
          onChangeText={setCode}
        />

        <Text style={styles.label}>نسبة الخصم %<Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="مثال: 10"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={discountValue}
          onChangeText={setDiscountValue}
        />

        <Text style={styles.label}>تاريخ الانتهاء <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{expiresAt.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={expiresAt}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>حد الاستخدام <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="مثال: 20"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={usageLimit}
          onChangeText={setUsageLimit}
        />

        {/* Hide button when keyboard is visible */}
        {!isKeyboardVisible && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.navigationButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>أضف</Text>
            </TouchableOpacity>
          </View>
        )}

                {/* Success Modal */}
                <SuccessModal 
                visible={successModalVisible} 
                message="تمت إضافة الكوبون بنجاح!" 
                buttonText="تم" 
                onPress={handleSuccessModalClose} 
            />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse', // Title on the right, icon on the left
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  contentContainer: {
    flex: 1,
    padding: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    textAlign: 'right',
  },
  required: {
    color: 'red', // Make the asterisk red
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 30,
    textAlign: 'right',
    fontFamily: 'AlmaraiBold',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    fontFamily: 'AlmaraiRegular',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
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

export default AddCoupon;
