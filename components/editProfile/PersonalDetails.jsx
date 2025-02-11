import { StyleSheet, Text, View, TextInput, Pressable, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SuccessModal from '../../components/modals/Success';
const PersonalDetails = ({ data }) => {

    const navigation = useNavigation(); 
    const [firstName, setFirstName] = useState(data?.first_name || '');
    const [lastName, setLastName] = useState(data?.last_name || '');
    const [email, setEmail] = useState(data?.email || '');
    const [phone, setPhone] = useState(data?.phone || '');
    const [location, setLocation] = useState(data?.location || '');
    const [serviceType, setServiceType] = useState(data?.service_type || '');
    const [sellerLogo, setSellerLogo] = useState(data?.seller_logo || null);
    const [sellerBanner, setSellerBanner] = useState(data?.seller_banner || null);
    const [status , setStatus] = useState(data?.status || '');


    const [successModalVisible, setSuccessModalVisible] = useState(false);
    
    // Handle modal close and navigate back
    const handleSuccessModalClose = () => {
      setSuccessModalVisible(false);
      navigation.replace('Profile'); // Navigate back to gallery after success
    };


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.canceled && result.assets.length > 0) {  // ✅ Check if assets exist
            setSellerLogo(result.assets[0].uri);
        }
    };
    
    const pickBannerImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });
    
        if (!result.canceled && result.assets.length > 0) {  // ✅ Check if assets exist
            setSellerBanner(result.assets[0].uri);
        }
    };
    

    const handleUpdate = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
    
            const formData = new FormData();
            
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('location', location);
            formData.append('service_type', serviceType);
            formData.append('status', status);
    
            // Handle seller_logo upload (Check if it's a local file)
            if (sellerLogo && sellerLogo.startsWith("file://")) {
                const localUri = sellerLogo;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;
    
                formData.append('seller_logo', {
                    uri: localUri,
                    name: filename,
                    type,
                });
            }
    
            // Handle seller_banner upload (Check if it's a local file)
            if (sellerBanner && sellerBanner.startsWith("file://")) {
                const localUri = sellerBanner;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;
    
                formData.append('seller_banner', {
                    uri: localUri,
                    name: filename,
                    type,
                });
            }
    
            // Log the submitted data
            console.log('Submitted Data:', {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                location: location,
                service_type: serviceType,
                seller_logo: sellerLogo,
                seller_banner: sellerBanner,
            });
    
            const response = await fetch(`https://leen-app.com/public/api/seller/info/update/${data.id}`, {
                method: 'POST', // Change to PUT if required by API
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Ensure token is included
                },
                body: formData,
            });
    
            const result = await response.json();
            console.log('API Response:', result);
    
            if (response.ok) {
                setSuccessModalVisible(true);
            } else {
                Alert.alert("خطأ", result.message || "حدث خطأ أثناء التحديث.");
            }
        } catch (error) {
            Alert.alert("خطأ", "حدث خطأ في الاتصال بالخادم.");
            console.error("Update Error:", error);
        }
    };
    
    
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Logo Selection */}
            <View style={styles.logoContainer}>
                <Pressable onPress={pickImage} style={styles.logoWrapper}>
                    {sellerLogo ? (
                        <Image source={{ uri: sellerLogo }} style={styles.logo} />
                    ) : (
                        <Icon name="camera" size={40} color="#888" />
                    )}
                </Pressable>
                
                {/* Edit Icon Above the Logo Container */}
                <TouchableOpacity onPress={pickImage} style={styles.editIconContainer}>
                    <Icon name="pencil-outline" size={20} color="#333" />
                </TouchableOpacity>
            </View>


            
            {/* Input Fields */}
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>الاسم الأول <Text style={styles.required}>*</Text></Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholderTextColor="#666" />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>الاسم الأخير <Text style={styles.required}>*</Text></Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholderTextColor="#666" />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>البريد الإلكتروني <Text style={styles.required}>*</Text></Text>
                <TextInput style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} placeholderTextColor="#666" />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>رقم الهاتف <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="أدخل رقم الهاتف"
                    placeholderTextColor="#666"
                />
            </View>



            <View style={styles.fieldContainer}>
                <Text style={styles.label}>الموقع <Text style={styles.required}>*</Text></Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholderTextColor="#666" />
            </View>

 

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>نوع الخدمة <Text style={styles.required}>*</Text></Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={serviceType} onValueChange={setServiceType} style={styles.picker}>
                        <Picker.Item label="حدد نوع الخدمة" value="" />
                        <Picker.Item label="خدمة داخلية" value="in_house" />
                        <Picker.Item label="خدمة في المقر" value="at_headquarter" />
                    </Picker>
                </View>
            </View>

            {/* Editable Banner Field */}
            <Text style={styles.label}>البانر<Text style={styles.required}>*</Text></Text>

            <TouchableOpacity onPress={pickBannerImage}>
                {sellerBanner ? (
                    <Image source={{ uri: sellerBanner }} style={styles.banner} />
                ) : (
                    <Icon name="camera" size={40} color="#888" />
                )}
                <View style={styles.bannerEditIconContainer}>
                    <Icon name="pencil-outline" size={24} color="#000" />
                </View>
            </TouchableOpacity>
            
            {/* Submit Button */}
            <Pressable style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.submitButtonText}>تحديث</Text>
            </Pressable>


             {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        message="تم التحديث بنجاح!"
        buttonText="اغلاق"
        onPress={handleSuccessModalClose}
      />

        </ScrollView>
    );
};

export default PersonalDetails;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff', // Ensure a clean background
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative', // Allow absolute positioning inside
    },
    logoWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        resizeMode: 'contain',

    },
    editIconContainer: {
        position: 'absolute',
        top: 60,  // Moves the edit icon above the logo slightly
        left: 100,
        backgroundColor: '#f6f6f6',
        padding: 6,
        borderRadius: 20,
        zIndex: 2,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontFamily: 'AlmaraiRegular',
        marginBottom: 5,
        color: '#333',
        textAlign: 'right',
    },
    required: {
        color: 'red',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        fontFamily: 'AlmaraiRegular',
        marginBottom: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingRight: 40, // Ensure enough space for the eye icon
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    picker: {
        color: '#333',
    },
    bannerContainer: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#E7E7E7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    banner: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    bannerEditIconContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#f6f6f6',
        padding: 6,
        borderRadius: 20,
        zIndex: 2,
    },
    submitButton: {
        backgroundColor: '#435E58',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
      },
      submitButtonText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'AlmaraiBold',
      },
});

