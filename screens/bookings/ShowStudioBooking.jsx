import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Alert,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import rejectionImg from '../../assets/images/avatars/remove.png';
// Utility functions for formatting time and date
const formatTime = (timeString) => {
  const time = new Date(`1970-01-01T${timeString}`);
  return new Intl.DateTimeFormat('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(time);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const ShowStudioBooking = ({ navigation, route}) => {

    const { item } = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Utility function to calculate additional services total
  const calculateAdditionalServicesTotal = (additionalItems) => {
    return additionalItems?.reduce(
      (total, additionalItem) => total + parseFloat(additionalItem.service.price),
      0
    ) || 0;
  };

  // Calculate total price
  const additionalServicesTotal = calculateAdditionalServicesTotal(item.additionalStudioServiceBookingItems);
  const totalPrice = parseFloat(item.studio_service.price) + additionalServicesTotal;


   // Handle booking rejection
   const handleRejectBooking = async (id) => {
    if (!rejectionReason.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال سبب الرفض');
      return;
    }

    setLoading(true);

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        `https://leen-app.com/public/api/seller/studioBookings/reject/${id}`,
        { request_rejection_reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setModalVisible(false);
      Alert.alert('نجاح', 'تم رفض الحجز بنجاح' , [{ text: 'حسنا' , onPress: () => navigation.navigate('StudioBookings') }]);
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء رفض الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };


  // Handle booking acceptance
const handleAcceptBooking = async (id) => {
  setLoading(true);

  try {
    const authToken = await AsyncStorage.getItem('authToken');
    
    const response = await axios.post(
      `https://leen-app.com/public/api/seller/studioBookings/accept/${id}`,
      {}, // No additional body needed for accept API
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    setLoading(false);
    Alert.alert('نجاح', 'تم قبول الحجز بنجاح' , [{ text: 'حسنا' , onPress: () => navigation.navigate('StudioBookings') }]);
  } catch (error) {
    setLoading(false);
    Alert.alert(
      'خطأ',
      'حدث خطأ أثناء قبول الحجز. يرجى المحاولة مرة أخرى.'
    );
  }
};


 return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>تفاصيل الحجز رقم {item.id}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Booking Details */}

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            {item.studio_service.name} ({item.studio_service.price} ريال)
          </Text>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>اسم العميل</Text>
            <Text style={styles.cardDetail}>
              {item.customer.first_name + ' ' + item.customer.last_name}
            </Text>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>هاتف العميل</Text>
            <Text style={styles.cardDetail}>{item.customer.phone}</Text>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>وقت البداية</Text>
            <Text style={styles.cardDetail}>{formatTime(item.start_time)}</Text>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>التاريخ</Text>
            <Text style={styles.cardDetail}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>المختصون</Text>
            <View>
              <Text style={styles.cardDetail}>{item.employee.name}</Text>
              {item.additionalStudioServiceBookingItems?.map((additionalItem) => (
                <Text key={additionalItem.id} style={styles.cardDetail}>
                  {additionalItem.employee.name}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>حالة الدفع</Text>
            <Text style={styles.cardDetail}>
              {item.payment_status === 'paid' ? 'مدفوع' : 'غير مدفوع بالكامل'}
            </Text>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>المبلغ المدفوع</Text>
            <Text style={styles.cardDetail}>{item.paid_amount} ريال</Text>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>الخصم</Text>
            <Text style={styles.cardDetail}>{item.studio_service.discount ? item.studio_service.percentage + '%' : 'لا يوجد خصم'}</Text>
          </View>

          <View style={styles.cardDetailContainer}>
            <Text style={styles.cardDetail}>حالة الحجز</Text>
            <Text style={styles.cardDetail}>
              {item.booking_status === 'done' ? 'مكتمل' : 'غير مكتمل'}
            </Text>
          </View>
          
        </View>

        {/* Additional Services */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>خدمات اضافية</Text>
          {item.additionalStudioServiceBookingItems?.map((additionalItem) => (
            <View key={additionalItem.id} style={styles.cardDetailContainer}>
              <Text style={styles.cardDetail}>{additionalItem.service.name}</Text>
              <Text style={styles.cardDetail}>{additionalItem.service.price} ريال</Text>
            </View>
          ))}
          <Text style={styles.cardTitle}>المبلغ الكلي: {totalPrice} ريال</Text>
          
          {item.booking_status === 'rejected' && (
          <View>
          <Text style={{ fontFamily: 'AlmaraiBold' , color: 'red' , fontSize: 16}}>سبب الرفض</Text>
          <Text style={styles.cardDetail}>{item.request_rejection_reason}</Text>
        </View>
          )}

        </View>
          
          {/* Reject or accept booking if it's new or pending, otherwise show back button */}
          {item.booking_status === 'pending' ? (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rejectButton]} 
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.rejectButtonText}>رفض الحجز</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]} 
                onPress={() => handleAcceptBooking(item.id)}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'جارٍ المعالجة...' : 'قبول الحجز'}
                </Text>
              </TouchableOpacity>

            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.backButton]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>العودة</Text>
            </TouchableOpacity>
          )
          }
      </ScrollView>

       {/* Rejection Reason Modal */}
       <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={rejectionImg} style={styles.modalImage} />
            <Text style={styles.modalTitle}>سبب رفض الحجز</Text>
            <TextInput
              style={styles.textInput}
              placeholder="يرجى كتابة سبب الرفض"
              placeholderTextColor="#888"
              multiline
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.rejectButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => handleRejectBooking(item.id)}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'جارٍ المعالجة...' : 'تأكيد'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      direction: 'rtl',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      marginTop: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#E7E7E7',
    },
    headerTitle: {
      fontSize: 20,
      color: '#000000',
      fontFamily: 'AlmaraiBold',
    },
    scrollContainer: {
      paddingBottom: 20, // Ensures scrollable content doesn't cut off at the bottom
    },
    cardContent: {
      padding: 20,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      margin: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      borderRightWidth: 7,
      borderRightColor: '#435E58',
    },
    cardTitle: {
      fontSize: 16,
      fontFamily: 'AlmaraiBold',
      color: '#435E58',
      marginBottom: 15,
    },
    cardDetailContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#e7e7e7',
      paddingBottom: 5,
    },
    cardDetail: {
      fontSize: 16,
      fontFamily: 'AlmaraiRegular',
      color: '#555',
      marginBottom: 5,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    actionButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginHorizontal: 5,
    },
    rejectButton: {
      borderColor: '#d9534f', // Red color for reject
      borderWidth: 2,
    },
    acceptButton: {
      backgroundColor: '#435E58', // Green color for accept
    },
    backButton: {
      backgroundColor: '#435E58',
      marginHorizontal: 15,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: 'AlmaraiBold',
    },
    rejectButtonText: {
      color: '#d9534f',
      fontSize: 16,
      fontFamily: 'AlmaraiBold',
    },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontFamily: 'AlmaraiBold' , marginBottom: 15 },
    textInput: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15, textAlign: 'right' , fontFamily: 'AlmaraiRegular' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    modalButton: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 8, alignItems: 'center' },
    cancelButton: { borderColor: '#d9534f', borderWidth: 2, backgroundColor: '#fff', color: '#d9534f' },
    confirmButton: { backgroundColor: '#435E58' },
    modalImage: { width: 100, height: 100, marginBottom: 15 },
  });

export default ShowStudioBooking