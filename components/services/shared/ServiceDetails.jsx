import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ServiceDetails = ({
  formData,
  handleAddServiceDetail,
  handleRemoveServiceDetail,
  newServiceDetail,
  setNewServiceDetail,
}) => {
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);

  const handleInputFocus = () => {
    if (scrollViewRef.current && textInputRef.current) {
      // Use `measure` to get the position of the TextInput
      textInputRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current.scrollTo({ y: pageY - 100, animated: true }); // Adjust offset as needed
      });
    }
  };

  const handleAddDetail = () => {
    if (newServiceDetail.trim()) {
      handleAddServiceDetail(newServiceDetail); // Add the new detail
      setNewServiceDetail(''); // Clear the input field
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>تفاصيل الخدمة
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>
      <View style={styles.serviceDetailsContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddDetail} // Use the new handler
        >
          <Icon name="plus" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TextInput
          ref={textInputRef}
          style={[styles.input, { width: '90%' }]}
          placeholder="أدخل تفاصيل الخدمة"
          value={newServiceDetail}
          onChangeText={(text) => setNewServiceDetail(text)}
          onFocus={handleInputFocus} // Scroll to input when focused
        />
      </View>
      {formData.service_details.map((item, index) => (
        <View key={index.toString()} style={styles.detailItem}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveServiceDetail(index)}
          >
            <Icon name="close" size={20} color="#ff0000" />
          </TouchableOpacity>
          <Text style={styles.detailText}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
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
    textAlign: 'right',
    fontFamily: 'AlmaraiBold',
  },
  serviceDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#435E58',
    padding: 10,
    borderRadius: 5,
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
});

export default ServiceDetails;