import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategorySelector = ({ formData, handleInputChange }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://leen-app.com/public/api/categories', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    handleInputChange('category_id', categoryId);
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    setSubCategories(selectedCategory?.sub_categories || []);
  };

  return (
    <View>
      <Text style={styles.label}>التصنيف
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>
      <RNPickerSelect
        placeholder={{ label: 'اختر التصنيف', value: null }}
        items={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        onValueChange={(value) => handleCategoryChange(value)}
        value={formData.category_id}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
      />

      <Text style={styles.label}>التصنيف الفرعي
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>
      <RNPickerSelect
        placeholder={{ label: 'اختر التصنيف الفرعي', value: null }}
        items={subCategories.map((subCategory) => ({
          label: subCategory.name,
          value: subCategory.id,
        }))}
        onValueChange={(value) => handleInputChange('sub_category_id', value)}
        value={formData.sub_category_id}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'AlmaraiBold',
    color: '#333',
    textAlign: 'right',
  },
  requiredAsterisk: {
    color: 'red', 
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold', // Apply your custom font here
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'right', // Align text to the right for RTL
  },
  inputAndroid: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold', // Apply your custom font here
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'right', // Align text to the right for RTL
  },
  placeholder: {
    color: '#999',
    fontFamily: 'AlmaraiBold', // Apply your custom font here
    textAlign: 'right', // Align text to the right for RTL
  },
});

export default CategorySelector;