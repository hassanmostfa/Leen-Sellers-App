import { 
    StyleSheet, 
    Text, 
    TextInput, 
    View, 
    TouchableOpacity, 
    Alert 
} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SuccessModal from '../../components/modals/Success';

const AddEmployee = () => {
    const navigation = useNavigation();
    const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });
    const [successModalVisible, setSuccessModalVisible] = useState(false); // State to manage success modal visibility

    const addEmployee = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch('https://leen-app.com/public/api/seller/employees/store', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });

            const result = await response.json();
            if (response.ok) {
                // Show success modal and reset employee data
                setSuccessModalVisible(true);
                setNewEmployee({ name: '', position: '' });
            } else {
                Alert.alert('خطأ', result.message || 'فشل في إضافة الموظف.');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            Alert.alert('خطأ', 'حدث خطأ غير متوقع.');
        }
    };

    // Function to handle modal close and navigate back
    const handleSuccessModalClose = () => {
        setSuccessModalVisible(false); // Close the modal
        navigation.goBack(); // Navigate back after success
    };

    return (
        <View style={styles.container}>
            {/* Header with Title at Start & Back Button at End */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>إضافة موظف جديد</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Form Inputs */}
            <View style={styles.contentContainer}>
                <Text style={styles.label}>اسم الموظف <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                    placeholder="مثال: محمد عبدالله" 
                    style={styles.input}
                    value={newEmployee.name}
                    onChangeText={(text) => setNewEmployee({ ...newEmployee, name: text })}
                />

                <Text style={styles.label}>الوظيفة <Text style={styles.requiredAsterisk}>*</Text></Text>
                <TextInput
                    placeholder="مثال: مصفف شعر"
                    style={styles.input}
                    value={newEmployee.position}
                    onChangeText={(text) => setNewEmployee({ ...newEmployee, position: text })}
                />
            </View>

            {/* Button at Bottom of Screen */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.navigationButton} onPress={addEmployee}>
                    <Text style={styles.buttonText}>أضف</Text>
                </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <SuccessModal 
                visible={successModalVisible} 
                message="تمت إضافة الموظف بنجاح!" 
                buttonText="تم" 
                onPress={handleSuccessModalClose} 
            />
        </View>
    );
};

export default AddEmployee;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row-reverse', // Title on the right, icon on the left
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E7E7E7',
    },
    headerTitle: {
        fontSize: 20,
        color: '#000000',
        fontFamily: 'AlmaraiBold',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'AlmaraiBold',
        color: '#333',
        textAlign: 'right',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E7E7E7',
        borderRadius: 5,
        padding: 10,
        marginBottom: 30,
        textAlign: 'right',
        fontFamily: 'AlmaraiBold',
    },
    requiredAsterisk: {
        color: 'red', // Make the asterisk red
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
    },
    navigationButton: {
        backgroundColor: '#435E58',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'AlmaraiBold',
    },
});
