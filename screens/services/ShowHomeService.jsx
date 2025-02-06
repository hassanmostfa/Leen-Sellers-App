import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet , ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShowHomeService = ({ route, navigation }) => {
  const { item } = route.params; // Access the item passed through navigation

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>تفاصيل الخدمة رقم : {item.id}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Service Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>{item.name}</Text>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>السعر: </Text>
          <Text style={styles.detailValue}>{item.price} ريال</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>التصنيف الاساسي: </Text>
          <Text style={styles.detailValue}>{item.category.name}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>التصنيف الفرعي: </Text>
          <Text style={styles.detailValue}>{item.sub_category.name}</Text> 
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>التقييم: </Text>
          <Text style={styles.detailValue}>{item.service_average_rating == 0 ? 'لا يوجد تقييم' : item.service_average_rating}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>نوع الحجز: </Text>
          <Text style={styles.detailValue}>{item.booking_status === 'immediate' ? 'فوري' : 'بموعد مسبق'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>مخصصة لـ: </Text>
          <Text style={styles.detailValue}>{item.gender === 'men' ? 'الرجال' : 'النساء'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>هل يوجد خصم ؟ </Text>
          <Text style={styles.detailValue} >{item.discount > 0 ? 'نعم' : 'لا'}</Text>
        </View>
        {item.discount > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>نسبة الخصم: </Text>
            <Text>{item.percentage}%</Text>
          </View>
        )}

        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}> هل يوجد نقاط ولاء لهذه الخدمة ؟ </Text>
          <Text style={styles.detailValue}>{item.points>0 ? item.points : 'لا يوجد'}</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 40,
    borderBottomColor: '#E7E7E7',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    margin: 10,
    borderRightWidth: 7,
    borderRightColor: '#435E58',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'AlmaraiBold',
    marginBottom: 10,
    marginTop: 15,
    color: '#435E58',
  },
  detailItem: {
    fontSize: 18,
    marginBottom: 5,
    paddingBottom: 5,
    color: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontFamily: 'AlmaraiRegular',
  },
  detailTitle: {
    color: '#555',
    fontFamily: 'AlmaraiBold',
  },
  detailValue: {
    color: '#333',
    fontFamily: 'AlmaraiRegular', 
  },
});

export default ShowHomeService;
