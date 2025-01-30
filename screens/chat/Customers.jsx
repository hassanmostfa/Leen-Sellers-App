import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TapNavigation from '../../components/TapNavigation';
import ChatCard from '../../components/ChatCard';
const Customers = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('Auth token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get('https://leen-app.com/public/api/seller/clients' , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الرسائل</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('#')}
          >
            <Text>
            <Icon name="clipboard-edit-outline" size={24} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('#')}
          >
            <Text>
            <Icon name="dots-horizontal" size={24} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Rooms */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={({ item }) => <ChatCard item={item} navigation={navigation} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.chatList}
        />
      )}

      {/* Tap Navigation */}
      <TapNavigation navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    direction: 'rtl',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(246, 246, 246, 1)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'AlmaraiBold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatList: {
    paddingBottom: 20,
  },
});

export default Customers;
