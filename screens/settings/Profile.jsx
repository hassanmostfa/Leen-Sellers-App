import { StyleSheet, View, Image, Dimensions, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import About from '../../components/profile/About';
import Employees from '../../components/profile/Employees';
import Images from '../../components/profile/Images';
import Videos from '../../components/profile/Videos';
import Ratings from '../../components/profile/Ratings';
const { width } = Dimensions.get('window'); // Get device width

const Profile = () => {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('نبذة'); // Default active tab

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) throw new Error('Token not found');

                const response = await fetch('https://leen-app.com/public/api/seller/info', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('فشل في جلب بيانات البائع');

                const result = await response.json();
                setData(result.data);
            } catch (error) {
                console.error('حدث خطأ أثناء جلب البيانات:', error);
            }
        };

        fetchData();
    }, []);

    // Function to render the active tab content
    const renderContent = () => {
        switch (activeTab) {
            case 'نبذة':
                return <About first_name={data?.first_name} last_name={data?.last_name} location={data?.location} />;
            case 'الموظفون':
                return <Employees />;
            case 'الصور':
                return <Images />;
            case 'الفيديوهات':
                return <Videos />;
                case 'التقييمات':
                return <Ratings />;
            default:
                return <About />;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" />
            
            {/* Banner */}
            <Image source={{ uri: data?.seller_banner }} style={styles.banner} />

            {/* Seller Logo */}
            <Image source={{ uri: data?.seller_logo }} style={styles.logo} />

            {/* Seller Name */}
            <Text style={styles.name}>{data?.first_name + ' ' + data?.last_name}</Text>

            {/* Edit Profile */}
            <TouchableOpacity style={styles.editProfile}>
                <Icon name="account-edit-outline" size={24} color="#435E58" />
                <Text style={styles.editText}>تعديل الحساب</Text>
            </TouchableOpacity>

            {/* Navigation Links */}
            <View style={styles.navContainer}>
                {['نبذة', 'الموظفون', 'الصور', 'الفيديوهات', 'التقييمات'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.navItem, activeTab === tab && styles.activeNavItem]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>{renderContent()}</View>
        </ScrollView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 20, // Add some padding to the bottom for the scroll
    },
    banner: {
        width: width, // Full width
        height: 150, // Adjust banner height
        resizeMode: 'cover',
    },
    logo: {
        resizeMode: 'contain',
        width: 100,
        height: 100,
        borderRadius: 50, // Circular logo
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    name: {
        marginTop: 60,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    editProfile: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#DFE8E5',
        borderRadius: 20,
    },
    editText: {
        fontSize: 16,
        color: '#435E58',
        fontFamily: 'AlmaraiBold',
    },
    navContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20,
        padding: 10,
    },
    navItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    activeNavItem: {
        backgroundColor: '#435E58', // Green background for active tab
    },
    navText: {
        fontSize: 14,
        color: '#435E58',
        fontFamily: 'AlmaraiRegular',
    },
    activeNavText: {
        color: '#fff', // White text for active tab
    },
    contentContainer: {
        width: '100%',
        paddingTop: 20,
    },
    pageContent: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});
