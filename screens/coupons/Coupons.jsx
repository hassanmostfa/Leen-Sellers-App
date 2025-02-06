import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Coupons = ({ navigation }) => {
  const [coupons, setCoupons] = useState([]); // Store coupons
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch coupons from API
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken'); // Retrieve token
      const response = await fetch('https://leen-app.com/public/api/seller/coupons', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCoupons(data.data || []); // Store coupons
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching coupons');
    } finally {
      setLoading(false);
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Format date to "DD/MM/YYYY"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Render a single row for the coupon table
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell , { color: '#56766F' }]}>{item.code}</Text>
      <Text style={styles.cell}>{item.discount_value}%</Text>
      <Text style={styles.cell}>{formatDate(item.expires_at)}</Text>
      <Text style={styles.cell}>{item.usage_limit}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>كل الكوبونات</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-right" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AddCoupon')} style={styles.addButton}>
          <Text style={{ fontSize: 16, color: '#fff', fontFamily: 'AlmaraiBold' }}>إضافة كوبون</Text>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title and Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>معاملات الدفع</Text>
        <Text style={styles.description}>
        تتيح لك هذه الصفحة إنشاء كوبونات وعروض خاصة لجذب المزيد من 
        العملاء وإدارة الكوبونات الحالية بسهولة.</Text>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#435E58" style={styles.loader} />
      ) : (
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>رمز الكوبون</Text>
            <Text style={styles.headerCell}>الخصم</Text>
            <Text style={styles.headerCell}>تاريخ الانتهاء</Text>
            <Text style={styles.headerCell}>حد الاستخدام</Text>
          </View>

          {/* Table Body */}
          <FlatList
            data={coupons}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row-reverse', // Title on the right, icon on the left
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#435E58',
    padding: 10,
    borderRadius: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  descriptionContainer: {
    padding: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    color: '#B0B0B0',
    textAlign: 'right',
  },
  tableContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row-reverse', // Align right-to-left
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    borderTopWidth: 1,
    borderTopColor: '#e7e7e7',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'AlmaraiBold',
    color: '#333',
  },
  row: {
    flexDirection: 'row-reverse', // Align right-to-left
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    color: '#333',
  },
});

export default Coupons;
