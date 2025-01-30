import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StepTitles = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <View style={styles.stepTitlesContainer}>
      {steps.map((step) => (
        <TouchableOpacity
          key={step.step}
          style={[
            styles.stepTitle,
            currentStep === step.step && styles.activeStepTitle,
          ]}
          onPress={() => setCurrentStep(step.step)}
        >
          <Text
            style={[
              styles.stepTitleText,
              currentStep === step.step && styles.activeStepTitleText,
            ]}
          >
            {step.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default StepTitles;