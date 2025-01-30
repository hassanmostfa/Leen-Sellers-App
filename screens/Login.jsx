import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import googleIcon from '../assets/images/avatars/google.png';
import facebookIcon from '../assets/images/avatars/facebook.png';
const Login = ({ navigation }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility



  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني/رقم الجوال وكلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://leen-app.com/public/api/seller/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save token to local storage and navigate to Home
        await AsyncStorage.setItem('authToken', data.data.token);
        navigation.replace('Home');
      } else {
        Alert.alert('فشل تسجيل الدخول', data.message || 'بيانات الاعتماد غير صالحة');
      }
    } catch (error) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Welcome Text */}
      <Text style={styles.title}>تسجيل الدخول</Text>

      {/* Email/Phone Input */}
      <Text style={styles.label}>البريد الإلكتروني او رقم الجوال</Text>
      <TextInput
        style={styles.input}
        placeholder="ادخل البريد الإلكتروني او رقم الجوال"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={login}
        onChangeText={setLogin}
      />

      {/* Password Input */}
      <Text style={styles.label}>كلمة المرور</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="ادخل كلمة المرور"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword} // Toggle password visibility
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Icon
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#B0B0B0"
          />
        </Pressable>
      </View>

      {/* Forget Password */}
      <Pressable
        onPress={() => navigation.navigate('#')}
        style={styles.forgetPasswordContainer}
      >
        <Text style={styles.forgetPasswordText}>نسيت كلمة المرور؟</Text>
      </Pressable>

      {/* Login Button */}
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        )}
      </Pressable>

      {/* Divider with "أو" */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>أو</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Login with Google */}
      <Pressable style={styles.socialButton}>
        {/* <Icon name="google-plus" size={24} color="#DB4437" /> */}
        <Image source={googleIcon} style={styles.socialButtonImage} />
        <Text style={styles.socialButtonText}>تسجيل الدخول باستخدام</Text>
      </Pressable>

      {/* Login with Facebook */}
      <Pressable style={styles.socialButton}>
        {/* <Icon name="facebook" size={24} color="#4267B2" /> */}
        <Image source={facebookIcon} style={styles.socialButtonImage} />
        <Text style={styles.socialButtonText}>تسجيل الدخول باستخدام</Text>
      </Pressable>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        ليس لديك حساب؟{' '}
        <Text
          onPress={() => navigation.navigate('Register')}
          style={styles.link}
        >
          إنشاء حساب
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    color: 'black',
    marginBottom: 30,
    fontFamily: 'AlmaraiBold',
  },
  label: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    fontFamily: 'AlmaraiRegular',
  },
  input: {
    backgroundColor: 'transparent',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: '#000',
    fontSize: 16,
    borderColor: '#E7E7E7',
    borderWidth: 2,
    fontFamily: 'AlmaraiRegular',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#E7E7E7',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#000',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  eyeIcon: {
    padding: 10,
  },
  forgetPasswordContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  forgetPasswordText: {
    color: 'rgba(93, 93, 93, 1)',
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
  },
  button: {
    backgroundColor: '#435E58',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e7e7e7',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#ccc',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    marginLeft: 10,
  },
  footerText: {
    color: '#5D5D5D',
    marginTop: 100,
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
  },
  link: {
    color: '#1485FD',
    fontFamily: 'AlmaraiBold',
  },
});

export default Login;