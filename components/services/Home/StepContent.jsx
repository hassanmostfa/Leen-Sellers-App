import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CategorySelector from '../shared/CategorySelector';
import EmployeeList from '../shared/EmployeeList';
import DiscountSection from '../shared/DiscountSection';
import ServiceDetails from '../shared/ServiceDetails';
import RadioGroup from '../shared/RadioGroup';

const StepContent = ({
  currentStep,
  formData,
  handleInputChange,
  handleAddServiceDetail,
  handleRemoveServiceDetail,
  newServiceDetail,
  setNewServiceDetail,
  employees,
  toggleEmployeeSelection,
  toggleDiscount,
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={styles.label}>
              اسم الخدمة
              <Text style={styles.requiredAsterisk}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="أدخل اسم الخدمة"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            <CategorySelector
              formData={formData}
              handleInputChange={handleInputChange}
            />
            <ServiceDetails
              formData={formData}
              handleAddServiceDetail={handleAddServiceDetail}
              handleRemoveServiceDetail={handleRemoveServiceDetail}
              newServiceDetail={newServiceDetail}
              setNewServiceDetail={setNewServiceDetail}
            />
          </View>
        );
      case 2:
        return (
          <EmployeeList
            employees={employees}
            formData={formData}
            toggleEmployeeSelection={toggleEmployeeSelection}
          />
        );
      case 3:
        return (
          <DiscountSection
            formData={formData}
            toggleDiscount={toggleDiscount}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderStepContent()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    textAlign: 'right',
  },
  requiredAsterisk: {
    color: 'red', // Make the asterisk red
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
};

export default StepContent;