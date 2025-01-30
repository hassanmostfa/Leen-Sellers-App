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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StepTitles from '../../components/services/shared/StepTitles';
import StepContent from '../../components/services/Home/StepContent';

const AddHomeService = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    category_id: '',
    sub_category_id: '',
    service_details: [],
    employees: [],
    price: '',
    booking_status: '',
    discount: 0,
    percentage: '',
    points: '',
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newServiceDetail, setNewServiceDetail] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // Track current step

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        'https://leen-app.com/public/api/seller/employees',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const toggleDiscount = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: value ? 1 : 0,
      percentage: value ? formData.percentage : '',
    }));
  };

  const toggleEmployeeSelection = (id) => {
    setFormData((prevFormData) => {
      const newEmployees = prevFormData.employees.includes(id)
        ? prevFormData.employees.filter((empId) => empId !== id)
        : [...prevFormData.employees, id];
      return { ...prevFormData, employees: newEmployees };
    });
  };

  const handleSubmit = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('خطأ', 'لم يتم العثور على رمز المصادقة');
        return;
      }

      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id, 10),
        sub_category_id: parseInt(formData.sub_category_id, 10),
        employees: formData.employees.map((empId) => empId.toString()),
        points: parseInt(formData.points, 10) || 0,
        service_details: formData.service_details.map((item) => item.trim()),
        price: parseFloat(formData.price),
        discount: formData.discount ? 1 : 0,
        percentage: formData.discount ? parseFloat(formData.percentage) : undefined,
        gender: formData.gender,
        booking_status: formData.booking_status,
      };

      console.log('Submitted Data:', payload);

      const response = await fetch(
        'https://leen-app.com/public/api/seller/homeServices/store',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('نجاح', 'تمت إضافة الخدمة المنزلية بنجاح', [
          { text: 'موافق', onPress: () => navigation.navigate('AddHomeService') },
        ]);
      } else {
        Alert.alert('خطأ', data.message || 'فشل في إضافة الخدمة المنزلية');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة الخدمة');
      console.error('Add Home Service Error:', error);
    }
  };

  const handleAddServiceDetail = (newDetail) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      service_details: [...prevFormData.service_details, newDetail.trim()],
    }));
  };

  const handleRemoveServiceDetail = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      service_details: prevFormData.service_details.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const steps = [
    { title: 'المعلومات الأساسية', step: 1 },
    { title: 'الموظفين', step: 2 },
    { title: 'السعر والخصومات', step: 3 },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }} // Set background to white
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>خدمة منزلية جديدة</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      <StepTitles
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <View style={styles.contentContainer}>
        <StepContent
          currentStep={currentStep}
          formData={formData}
          handleInputChange={handleInputChange}
          handleAddServiceDetail={handleAddServiceDetail}
          handleRemoveServiceDetail={handleRemoveServiceDetail}
          newServiceDetail={newServiceDetail}
          setNewServiceDetail={setNewServiceDetail}
          employees={employees}
          toggleEmployeeSelection={toggleEmployeeSelection}
          toggleDiscount={toggleDiscount}
        />
      </View>
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.buttonText}>السابق</Text>
          </TouchableOpacity>
        )}
        {currentStep < 3 ? (
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => setCurrentStep(currentStep + 1)}
          >
            <Text style={styles.buttonText}>التالي</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>إضافة الخدمة</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    direction: 'rtl',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlign: 'right',
    fontFamily: 'AlmaraiBold',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    textAlign: 'right',
  },
  stepTitlesContainer: {
    direction: 'rtl',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  stepTitle: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeStepTitle: {
    borderBottomColor: '#435E58', // Green border for active step
  },
  stepTitleText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'AlmaraiBold',
  },
  activeStepTitleText: {
    color: '#435E58', // Green text for active step
  },
  buttonContainer: {
    direction: 'rtl',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  navigationButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  submitButton: {
    backgroundColor: '#435E58',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  employeeItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 20,
  },
  employeeName: {
    marginRight: 10,
    fontFamily: 'AlmaraiBold',
  },
  serviceDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2f3e3b',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  serviceDetailsList: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  detailText: {
    fontFamily: 'AlmaraiBold',
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  radioButtonText: {
    marginRight: 5,
    fontFamily: 'AlmaraiBold',
  },
});

export default AddHomeService;