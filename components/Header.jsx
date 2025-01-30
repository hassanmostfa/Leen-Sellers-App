import { View, Text , TouchableOpacity , StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Header = ({navigation , title , route}) => {
  return (
    <SafeAreaView>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-right" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate(route)}>
            <Icon name="plus" size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2f3e3b',
        padding: 15,
        direction: 'rtl',
      },
      headerTitle: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
      },
})
export default Header