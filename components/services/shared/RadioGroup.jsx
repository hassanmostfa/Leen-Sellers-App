import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RadioGroup = ({ title, options, selectedValue, onValueChange }) => {
  return (
    <View>
      <Text style={styles.label}>{title}
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>
      <View style={styles.radioGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioButton}
            onPress={() => onValueChange(option)}
          >
            <Icon
              name={
                selectedValue === option ? 'radiobox-marked' : 'radiobox-blank'
              }
              size={20}
              color="#435E58"
            />
            <Text style={styles.radioButtonText}>
              {option === 'immediate'
                ? 'فوري'
                : option === 'previous_date'
                ? 'بموعد مسبق'
                : option === 'women'
                ? 'نساء'
                : option === 'men'
                ? 'رجال'
                : 'كلاهما'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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

export default RadioGroup;