import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet , Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TapNavigation from '../components/TapNavigation';
import avatar from '../assets/images/avatars/avatar03.jpg';
import SarFlag from '../assets/images/avatars/sr-flag.png';
const More = ({ navigation}) => {
  const menuItems = [
    { title: 'الرئيسية', icon: 'home-outline' },
    { title: 'صفحات التواصل', icon: 'account-outline' },
    { title: 'الفريق', icon: 'account-group-outline' },
    { title: 'مواعيد العمل', icon: 'calendar-month-outline' },
    { title: 'الخدمات المنزلية', icon: 'basket-outline' },
    { title: 'خدمات المقر', icon: 'store-outline' },
    { title: 'الإعدادات', icon: 'cog-outline' },
    { title: 'طرق الدفع', icon: 'credit-card-outline' },
  ];

  return (
    <View style={styles.container}>

         {/* Header */}
         <View style={styles.header}>
      {/* Bell Icon at Start */}
      <View style={{ flexDirection: 'row', alignItems: 'center' , gap: 25 }}>
        
      {/* Centered Circular Image */}
      <Image 
        source={avatar}
        style={styles.profileImage} 
      />

      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Text>
        <Icon name="bell-outline" size={24} color="#000000" />
        </Text>
      </TouchableOpacity>
      </View>

      {/* Search Icon at End */}
      <TouchableOpacity>
        <Icon name="magnify" size={24} color="#000000" />
      </TouchableOpacity>
    </View>

            
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Icon name={item.icon} size={24} color="#151E1D" />
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

{/* Language & Support Section */}
<View style={styles.languageContainer}>
  {/* Language Selection */}
  <TouchableOpacity style={styles.languageCard}>
    <View style={styles.languageRow}>
      <Image source={SarFlag} style={styles.flagImage} />
      <Text style={styles.text}>عربي</Text>
    </View>
    <Icon name="chevron-left" size={24} color="black" />
  </TouchableOpacity>

  {/* Support Section */}
  <TouchableOpacity style={styles.languageCard}>
    <View style={styles.languageRow}>
    <Icon name="help-circle-outline" size={24} color="#151E1D" />
    <Text style={styles.text}>المساعدة و الدعم</Text>
    </View>
    <Icon name="chevron-left" size={24} color="black" />
  </TouchableOpacity>
</View>


      {/* Navigation Bar */}
      <TapNavigation navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    direction: 'rtl',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 30,
    direction: 'rtl',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular Image
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  text: {
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
    color: 'black',
    marginTop: 10,
  },
  languageContainer: {
    marginTop: 30,
    borderWidth: 1,
    marginHorizontal: 15,
    borderColor: "#E7E7E7",
    borderRadius: 10, // Rounded corners
    overflow: "hidden", // Ensures rounded edges apply correctly
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Space between flag and text
  },
  flagImage: {
    width: 25,  // Adjusted flag width
    height: 25, // Adjusted flag height
    borderRadius: 50, // Slight rounding for a realistic flag look
  },
  text: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    fontFamily: "AlmaraiRegular",
  },
});

export default More;
