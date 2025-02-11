import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; // Replace this with Expo Picker
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterForm = ({ phoneNumber, navigation , route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [sellerLogo, setSellerLogo] = useState(null);
  const [sellerBanner, setSellerBanner] = useState(null);
  const [license, setLicense] = useState(null);

  const { phone } = route.params ;
  // Function to pick images using expo-image-picker
  const pickFile = async (setFileState) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Error', 'Permission to access media library is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Ensure only images are selected
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('ImagePicker Result:', result); // Debugging: Log the result

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFileState(result.assets[0].uri); // Use the first asset's URI
    }
  };

  const handleSubmit = async () => {

    if (!serviceType) {
      Alert.alert('Error', 'Please select a service type');
      return;
    }

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);
    formData.append('phone', phone);
    formData.append('location', location);
    formData.append('service_type', serviceType);

    if (sellerLogo) {
      formData.append('seller_logo', {
        uri: sellerLogo,
        type: 'image/jpeg',
        name: 'seller_logo.jpg',
      });
    }

    if (sellerBanner) {
      formData.append('seller_banner', {
        uri: sellerBanner,
        type: 'image/jpeg',
        name: 'seller_banner.jpg',
      });
    }

    if (license) {
      formData.append('license', {
        uri: license,
        type: license.includes('.pdf') ? 'application/pdf' : 'image/jpeg',
        name: 'license',
      });
    }

    try {
      const response = await fetch(
        'https://leen-app.com/public/api/seller/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
          
        }
      );
      console.log(formData);
      
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Registration successful');
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>أكمل التسجيل</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="الاسم الأول"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="الاسم الأخير"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="تأكيد كلمة المرور"
        secureTextEntry
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="الموقع"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor="#666"
      />

      {/* Service Type Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={serviceType}
          onValueChange={(itemValue) => setServiceType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="حدد نوع الخدمة" value="" />
          <Picker.Item label="خدمة داخلية" value="in_house" />
          <Picker.Item label="خدمة في المقر" value="at_headquarter" />
        </Picker>
      </View>

      {/* File Upload Cards */}
      <Pressable style={styles.fileCard} onPress={() => pickFile(setSellerLogo)}>
        {sellerLogo ? (
          <Image source={{ uri: sellerLogo }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          <>
            <Icon name="image-outline" size={40} color="#B0B0B0" />
            <Text style={styles.fileCardText}>اختر شعار البائع</Text>
          </>
        )}
      </Pressable>

      <Pressable style={styles.fileCard} onPress={() => pickFile(setSellerBanner)}>
        {sellerBanner ? (
          <Image source={{ uri: sellerBanner }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          <>
            <Icon name="image-outline" size={40} color="#B0B0B0" />
            <Text style={styles.fileCardText}>اختر بانر البائع</Text>
          </>
        )}
      </Pressable>

      <Pressable style={styles.fileCard} onPress={() => pickFile(setLicense)}>
        {license ? (
          <Image source={{ uri: license }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          <>
            <Icon name="file-document" size={40} color="#B0B0B0" />
            <Text style={styles.fileCardText}>اختر الترخيص</Text>
          </>
        )}
      </Pressable>

      {/* Submit Button */}
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>تسجيل</Text>
      </Pressable>

      {/* Footer Text */}
      {/* <Text style={styles.footerText}>
        هل لديك حساب؟{' '}
        <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
          تسجيل دخول
        </Text>
      </Text> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'AlmaraiBold',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E7E7E7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: '#333',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E7E7E7',
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    color: '#333',
    fontFamily: 'AlmaraiRegular',
  },
  fileCard: {
    borderWidth: 2,
    borderColor: '#E7E7E7',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    height: 150, // Fixed height for the card
  },
  fileCardText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 10,
    fontFamily: 'AlmaraiRegular',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
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
  footerText: {
    color: '#666',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'AlmaraiRegular',
  },
  link: {
    color: '#f08b47',
    fontWeight: 'bold',
    fontFamily: 'AlmaraiBold',
  },
});

export default RegisterForm;