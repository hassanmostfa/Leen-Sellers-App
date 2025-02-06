import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  Switch,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategorySelector from '../../components/services/shared/CategorySelector';
import SuccessModal from '../../components/modals/Success';
const UpdateHomeService = ({ route, navigation }) => {
    const { item } = route.params; // Extract the passed item
    const [successModalVisible, setSuccessModalVisible] = useState(false);


    const [formData, setFormData] = useState({
      name: item?.name || '',
      category_id: item?.category?.id || '',
      sub_category_id: item?.sub_category?.id || '',
      service_details: item?.service_details ? JSON.parse(item.service_details) : [],
      employees: item?.employees?.map(employee => String(employee.id)) || [], // Map employees' IDs to string
      price: item?.price?.toString() || '',
      discount: item?.discount ? 1 : 0,
      percentage: item?.percentage || '',
      points: item?.points?.toString() || '',
      gender: item?.gender || '',
      booking_status: item?.booking_status || '',
    });
    
    const [newServiceDetail, setNewServiceDetail] = useState('');
    const [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Fetch all employees
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'Authentication token is missing.');
          return;
        }
    
        const response = await fetch('https://leen-app.com/public/api/seller/employees', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }
    
        const data = await response.json();
        setAllEmployees(data.data || []);
      } catch (error) {
        console.error('Error fetching employees:', error.message);
        Alert.alert('Error', 'Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };
    
    // Handle input change for formData
    const handleInputChange = (key, value) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
    
    // Toggle discount state
    const toggleDiscount = () => {
      setFormData((prev) => ({
        ...prev,
        discount: prev.discount === 1 ? 0 : 1,
      }));
    };
    
    // Add a service detail
    const handleAddServiceDetail = () => {
      if (newServiceDetail.trim() === '') {
        Alert.alert('Error', 'Cannot add an empty field.');
        return;
      }
    
      if (formData.service_details.includes(newServiceDetail.trim())) {
        Alert.alert('Error', 'This detail has already been added.');
        return;
      }
    
      setFormData((prev) => ({
        ...prev,
        service_details: [...prev.service_details, newServiceDetail.trim()],
      }));
    
      setNewServiceDetail(''); // Clear the input field
    };
    
    // Remove a service detail
    const handleRemoveServiceDetail = (index) => {
      const updatedDetails = [...formData.service_details];
      updatedDetails.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        service_details: updatedDetails,
      }));
    };
    
    // Handle Employee Selection (only send IDs in array format as strings)
    const toggleEmployee = (employeeId) => {
      setFormData((prev) => {
        const isSelected = prev.employees.includes(employeeId.toString());
        return {
          ...prev,
          employees: isSelected
            ? prev.employees.filter((id) => id !== employeeId.toString()) // Remove if already selected
            : [...prev.employees, employeeId.toString()], // Add if not selected
        };
      });
    };
    
    // Submit the form
    const handleSubmit = async () => {
      setLoading(true);
    
      const payload = {
        booking_status: formData.booking_status,
        category_id: parseInt(formData.category_id, 10),
        discount: formData.discount,
        employees: formData.employees, // Send only IDs like ["1", "2"]
        gender: formData.gender,
        name: formData.name,
        percentage: formData.percentage,
        points: formData.points,
        price: formData.price,
        service_details: formData.service_details,
        sub_category_id: parseInt(formData.sub_category_id, 10),
      };
     
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`https://leen-app.com/public/api/seller/homeServices/update/${item.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
    
        const result = await response.json();
        setSuccessModalVisible(true);
      } catch (error) {
        console.error('Error updating service: ', error);
        Alert.alert('Error', 'Failed to update service');
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch employees on mount
    useEffect(() => {
      fetchAllEmployees();
    }, []);
    

      // Handle modal close and navigate back
  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('HomeServices'); // Navigate back to gallery after success
  };   

    return (
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
          <FlatList
              keyboardShouldPersistTaps="handled"
              data={[]}
              ListHeaderComponent={
                  <>
                      {/* Header */}
                      <View style={styles.header}>
                          <TouchableOpacity onPress={() => navigation.goBack()}>
                              <Icon name="arrow-left" size={24} color="#000000" />
                          </TouchableOpacity>
                          <Text style={styles.headerTitle}>تحديث بيانات الخدمة رقم : {item.id}</Text>
                      </View>
  
                      <View style={styles.container}>
                          {/* Input Fields */}
                          <Text style={styles.label}>اسم الخدمة</Text>
                          <TextInput
                              style={styles.input}
                              placeholder="اسم الخدمة"
                              value={formData.name}
                              onChangeText={(value) => handleInputChange('name', value)}
                          />
  
                          {/* Category Selector */}
                          <CategorySelector formData={formData} handleInputChange={handleInputChange} />
  
                          <Text style={styles.label}>السعر</Text>
                          <TextInput
                              style={styles.input}
                              placeholder="السعر"
                              keyboardType="decimal-pad"
                              value={formData.price}
                              onChangeText={(value) => handleInputChange('price', value)}
                          />
  
                          {/* Discount Switch */}
                          <View style={styles.discountContainer}>
                              <Text style={styles.label}>هل يوجد خصم؟</Text>
                              <Switch
                                  value={formData.discount === 1}
                                  onValueChange={toggleDiscount}
                                  thumbColor={formData.discount === 1 ? '#2f3e3b' : '#ddd'}
                                  trackColor={{ false: '#ddd', true: '#2f3e3b' }}
                              />
                          </View>
  
                          {formData.discount === 1 && (
                              <>
                                  <Text style={styles.label}>النسبة المئوية</Text>
                                  <TextInput
                                      style={styles.input}
                                      placeholder="النسبة المئوية"
                                      keyboardType="decimal-pad"
                                      value={formData.percentage}
                                      onChangeText={(value) => handleInputChange('percentage', value)}
                                  />
                              </>
                          )}
  
                          <Text style={styles.label}>عدد النقاط</Text>
                          <TextInput
                              style={styles.input}
                              placeholder="عدد النقاط"
                              keyboardType="numeric"
                              value={formData.points}
                              onChangeText={(value) => handleInputChange('points', value)}
                          />
  
                          {/* Gender Selection */}
                          <View style={styles.radioGroup}>
                              <Text style={styles.label}>الجنس:</Text>
                              {['women', 'men'].map((gender) => (
                                  <TouchableOpacity
                                      key={gender}
                                      style={styles.radioButton}
                                      onPress={() => handleInputChange('gender', gender)}
                                  >
                                      <Icon
                                          name={formData.gender === gender ? 'radiobox-marked' : 'radiobox-blank'}
                                          size={20}
                                          color="#435E58"
                                      />
                                      <Text style={{fontFamily: 'AlmaraiRegular'}}>{gender === 'women' ? 'نساء' : 'رجال'}</Text>
                                  </TouchableOpacity>
                              ))}
                          </View>
  
                          {/* Booking Type Selection */}
                          <View style={styles.radioGroup}>
                              <Text style={styles.label}>نوع الحجز:</Text>
                              {['immediate', 'previous_date'].map((booking_status) => (
                                  <TouchableOpacity
                                      key={booking_status}
                                      style={styles.radioButton}
                                      onPress={() => handleInputChange('booking_status', booking_status)}
                                  >
                                      <Icon
                                          name={formData.booking_status === booking_status ? 'radiobox-marked' : 'radiobox-blank'}
                                          size={20}
                                          color="#435E58"
                                      />
                                      <Text style={{fontFamily: 'AlmaraiRegular'}}>{booking_status === 'immediate' ? 'فوري' : 'بموعد مسبق'}</Text>
                                  </TouchableOpacity>
                              ))}
                          </View>
  
                          {/* Service Details Section */}
                          <View style={styles.serviceDetailsContainer}>
                              <TouchableOpacity
                                  style={styles.addButton}
                                  onPress={() => handleAddServiceDetail(newServiceDetail)}
                              >
                                  <Icon name="plus" size={24} color="#ffffff" />
                              </TouchableOpacity>
  
                              <TextInput
                                  style={[styles.input, { width: '90%' }]}
                                  placeholder="تفاصيل الخدمة"
                                  onChangeText={(text) => setNewServiceDetail(text)}
                              />
                          </View>
  
                          {/* Service Details List */}
                          <FlatList
                              style={styles.serviceDetailsList}
                              data={formData.service_details}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item, index }) => (
                                  <View style={styles.detailItem}>
                                      <TouchableOpacity
                                          style={styles.removeButton}
                                          onPress={() => handleRemoveServiceDetail(index)}
                                      >
                                          <Icon name="close" size={20} color="#ff0000" />
                                      </TouchableOpacity>
                                      <Text style={{fontFamily: 'AlmaraiRegular'}}>{item}</Text>
                                  </View>
                              )}
                          />
  
                          {/* Employee List Section */}
                          <View style={styles.employeeListContainer}>
                              <Text style={styles.label}>اختر الموظفين:</Text>
                              <FlatList
                                  data={allEmployees}
                                  keyExtractor={(employee) => employee.id.toString()}
                                  renderItem={({ item }) => (
                                      <TouchableOpacity
                                          onPress={() => toggleEmployee(item.id)}
                                          style={styles.employeeItem}
                                      >
                                          <Icon
                                              name={
                                                  formData.employees.includes(item.id.toString())
                                                      ? 'checkbox-marked'
                                                      : 'checkbox-blank-outline'
                                              }
                                              size={20}
                                              color="#435E58"
                                          />
                                          <Text style={{fontFamily: 'AlmaraiRegular'}}>{item.name}</Text>
                                      </TouchableOpacity>
                                  )}
                              />
                          </View>
  
                          {/* Submit Button */}
                          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                              <Text style={styles.submitText}>تحديث الخدمة</Text>
                          </TouchableOpacity>
                      </View>
                  </>
              }
              keyExtractor={() => "key"} // dummy key extractor
          />

          {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        message="تم تحديث الخدمة بنجاح!"
        buttonText="حسنا"
        onPress={handleSuccessModalClose}
      />

      </KeyboardAvoidingView>
  );
};
export default UpdateHomeService;


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomColor: '#E7E7E7',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlign: 'right',
    fontFamily: 'AlmaraiRegular',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    textAlign: 'right',
  },
  radioGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
    gap: 20,
  },
  radioButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginLeft: 15,
  },
  employeeItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    gap: 10,
    fontFamily: 'AlmaraiRegular',
  },
  serviceDetailsContainer: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  addButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#435E58',
    padding: 5,
    borderRadius: 5,
    height: 43,
  },
  serviceDetailsList: {
      marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: '#e7e7e7',
    padding: 10,
    borderRadius: 15,
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    direction: 'rtl',
  },
});

