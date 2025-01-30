import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import RadioGroup from '../shared/RadioGroup';

const DiscountSection = ({ formData, toggleDiscount, handleInputChange }) => {
  return (
    <View>
      <View style={styles.discountContainer}>
        <Switch
          value={formData.discount === 1}
          onValueChange={toggleDiscount}
          thumbColor={formData.discount === 1 ? '#435E58' : '#ddd'}
          trackColor={{ false: '#ddd', true: '#435E58' }}
        />
      <Text style={styles.label}>هل يوجد خصم ؟</Text>
      </View>
      {formData.discount === 1 && (
        <>
          <Text style={styles.label}>النسبة المئوية للخصم</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: 10"
            keyboardType="decimal-pad"
            value={formData.percentage}
            onChangeText={(value) => handleInputChange('percentage', value)}
          />
        </>
      )}
      <Text style={styles.label}>عدد النقاط</Text>
      <TextInput
        style={styles.input}
        placeholder="أدخل عدد النقاط"
        keyboardType="numeric"
        value={formData.points.toString()}
        onChangeText={(value) => handleInputChange('points', value)}
      />

<Text style={styles.label}>السعر
<Text style={styles.requiredAsterisk}> *</Text>
</Text>
          <TextInput
            style={styles.input}
            placeholder="أدخل السعر"
            keyboardType="decimal-pad"
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
          />
          <RadioGroup
            title="نوع الحجز"
            options={['immediate', 'previous_date']}
            selectedValue={formData.booking_status}
            onValueChange={(value) => handleInputChange('booking_status', value)}
          />
          <RadioGroup
            title="الجنس"
            options={['women', 'men']}
            selectedValue={formData.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
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
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default DiscountSection;