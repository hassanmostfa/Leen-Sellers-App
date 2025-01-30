import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShowHomeService = ({ route, navigation }) => {
  const { item } = route.params; // Access the item passed through navigation

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>تفاصيل الخدمة رقم : {item.id}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-right" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Service Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>{item.name}</Text>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>السعر: </Text>
          <Text>{item.price} ريال</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>التصنيف الاساسي: </Text>
          <Text>{item.category.name}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>التصنيف الفرعي: </Text>
          <Text>{item.sub_category.name}</Text> 
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>التقييم: </Text>
          <Text>{item.service_average_rating == 0 ? 'لا يوجد تقييم' : item.service_average_rating}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>نوع الحجز: </Text>
          <Text>{item.booking_status === 'immediate' ? 'فوري' : 'بموعد مسبق'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>مخصصة لـ: </Text>
          <Text>{item.gender === 'men' ? 'الرجال' : 'النساء'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>هل يوجد خصم ؟ </Text>
          <Text >{item.discount > 0 ? 'نعم' : 'لا'}</Text>
        </View>
        {item.discount > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>نسبة الخصم: </Text>
            <Text>{item.percentage}%</Text>
          </View>
        )}

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}> هل يوجد نقاط ولاء لهذه الخدمة ؟ </Text>
          <Text>{item.points>0 ? item.points : 'لا يوجد'}</Text>
        </View>

        {/* Service Details */}
        <Text style={styles.sectionTitle}>تفاصيل الخدمة</Text>
        {JSON.parse(item.service_details).map((detail, index) => (
            <Text style={styles.detailItem} key={index}>
              - {detail}
              
          </Text>
        ))}

        {/* Employees */}
        <Text style={styles.sectionTitle}>الموظفون</Text>
        {item.employees.map((employee) => (
          <Text style={styles.detailItem} key={employee.id}>
            - {employee.name}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2f3e3b',
    padding: 15,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    color: '#2f3e3b',
  },
  detailItem: {
    fontSize: 20,
    marginBottom: 5,
    paddingBottom: 5,
    color: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  detailTitle: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 18,
  },
});

export default ShowHomeService;
