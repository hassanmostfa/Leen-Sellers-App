import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PersonalDetails from '../../components/editProfile/PersonalDetails';
import Timetable from '../Timetable';
const WorkSchedule = () => <Text style={styles.contentText}>محتوى مواعيد العمل</Text>;

const EditProfile = ({ navigation , route }) => {
    const [activeTab, setActiveTab] = useState('personal');
    const { data } = route.params;
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>
            
            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
                    onPress={() => setActiveTab('personal')}
                >
                    <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>التفاصيل الشخصية</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'work' && styles.activeTab]}
                    onPress={() => setActiveTab('work')}
                >
                    <Text style={[styles.tabText, activeTab === 'work' && styles.activeTabText]}>مواعيد العمل</Text>
                </TouchableOpacity>
            </View>
            
            {/* Content */}
            <View style={styles.contentContainer}>
                {activeTab === 'personal' ? <PersonalDetails data={data} /> : <Timetable />}
            </View>
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 10,
    },
    header: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 30,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        color: '#000000',
        fontFamily: 'AlmaraiBold',
    },
    tabsContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        marginVertical: 15,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: '#435E58',
    },
    tabText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'AlmaraiBold',
    },
    activeTabText: {
        color: '#fff',
        fontFamily : 'AlmaraiBold'
    },
    contentContainer: {
        flex: 1,
        marginTop: 20,
    },
    contentText: {
        fontSize: 18,
        color: '#333',
    },
});
