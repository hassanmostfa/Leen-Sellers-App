import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmployeeList = ({ employees, formData, toggleEmployeeSelection }) => {
  return (
    <View>
      <Text style={styles.label}>اختر الموظفين (يمكنك اختيار اكثر من موظف)
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>
      <ScrollView>
        {employees.map((item) => (
          <TouchableOpacity
            key={item.id.toString()}
            style={styles.employeeItem}
            onPress={() => toggleEmployeeSelection(item.id)}
          >
            <Icon
              name={
                formData.employees.includes(item.id)
                  ? 'checkbox-marked'
                  : 'checkbox-blank-outline'
              }
              size={20}
              color="#435E58"
            />
            <Text style={styles.employeeName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  employeeItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 20,
  },
  employeeName: {
    marginRight: 10,
    fontFamily: 'AlmaraiBold',
  },
});

export default EmployeeList;