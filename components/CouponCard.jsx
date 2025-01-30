import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CouponImg from '../assets/images/avatars/gift-card.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد';
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const CouponCard = ({ item, navigation }) => {

  // Handle coupon delete
  const handleDeleteCoupon = async () => {
    const token = await AsyncStorage.getItem('authToken');
    console.log("Token:", token);  // Check if the token is valid

    if (!token) {
      Alert.alert('خطأ', 'لا يمكن حذف الكوبون بدون تسجيل الدخول.');
      return;
    }

    // Show a confirmation dialog before deletion
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد أنك تريد حذف هذا الكوبون؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          onPress: async () => {
            try {

              const response = await fetch(`https://leen-app.com/public/api/seller/coupons/destroy/${item.id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              const responseData = await response.json();

              if (response.ok) {
                Alert.alert('نجاح', 'تم حذف الكوبون بنجاح.', [
                  { text: 'حسناً', onPress: () => navigation.replace('Coupons') },
                ]);
              } else {
                Alert.alert('خطأ', responseData.message || 'حدث خطأ أثناء حذف الكوبون.');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('خطأ', 'تعذر الاتصال بالخادم.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.couponTitle}>كوبون رقم {item.id}</Text>
          <Text style={styles.couponCode}>الكود: {item.code || 'N/A'}</Text>
          <Text style={styles.couponExpiry}>
            تاريخ الانتهاء: {formatDate(item.expires_at)}
          </Text>
          <Text style={styles.couponCode}>حد الاستخدام: {item.usage_limit || 'N/A'}</Text>
          <Text style={styles.couponCode}>عدد مرات الاستخدام: {item.usage_count}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image source={CouponImg} style={styles.cardImage} />
          <Text style={styles.couponDiscount}>الخصم: {item.discount_value}%</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('UpdateCoupon', { item })}>
          <MaterialCommunityIcons name="pen" size={20} color="#ffffff" style={styles.icon} />
          <Text style={styles.buttonText}>تعديل</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCoupon()}>
          <MaterialCommunityIcons name="delete" size={20} color="#ffffff" style={styles.icon} />
          <Text style={styles.buttonText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    direction: 'rtl',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2f3e3b',
  },
  couponCode: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  couponExpiry: {
    fontSize: 14,
    marginBottom: 10,
    color: '#888',
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 5,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  deleteButton: {
    backgroundColor: '#e53935',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#2f3e3b',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CouponCard;
