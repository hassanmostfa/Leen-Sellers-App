import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const StudioServiceCard = ({ item, navigation }) => {
  const handleShow = () => {
    navigation.navigate('ShowStudioService', { item }); // Navigate to route with item data
  };

  const handleDelete = async () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد أنك تريد حذف هذه الخدمة؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          onPress: async () => {
            try {
              const authToken = await AsyncStorage.getItem('authToken'); // Get token from localStorage
              const response = await fetch(
                `https://leen-app.com/public/api/seller/studioServices/destroy/${item.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (response.ok) {
                Alert.alert("نجاح",'تم الحذف بنجاح',{text: 'حسناً'}
                );
                navigation.navigate('StudioServices');
              } else {
                Alert.alert('خطأ','حدث خطأ أثناء الحذف');
              }
            } catch (error) {
              Alert.alert('خطأ','حدث خطأ أثناء الحذف', error.message);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.card, { direction: 'rtl' }]}>
      {item.discount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.percentage}% خصم</Text>
        </View>
      )}
      <Image
        source={{ uri: item.sub_category.image }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>السعر : {item.price} ريال</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#f08b47" />
          <Text style={styles.ratingText}>
            {item.service_average_rating == 0 ? 'لا يوجد تقييم' : item.service_average_rating}
          </Text>
        </View>
        <Text style={styles.servicePrice}>نوع الحجز : {item.booking_status === 'immediate' ? 'فوري' : 'بموعد مسبق'}</Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShow}>
          <Icon name="eye" size={24} color="#2f3e3b" />
          <Text style={styles.actionText}>عرض</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={()=> navigation.navigate('UpdateStudioService', { item })}>
          <Icon name="pencil" size={24} color="#f08b47" />
          <Text style={styles.actionText}>تعديل</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Icon name="delete" size={24} color="#dc3545" />
          <Text style={styles.actionText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    elevation: 3,
    padding: 10,
    direction: 'rtl',
  },
  badge: {
    position: 'absolute',
    top: 180,
    left: 10,
    backgroundColor: '#2f3e3b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
  },
  detailsContainer: {
    padding: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default StudioServiceCard;
