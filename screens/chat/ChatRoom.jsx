import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EmojiSelector from "react-native-emoji-selector";  // Emoji Picker
import ChatImg from '../../assets/images/avatars/chat.png';

const ChatRoom = ({ route, navigation }) => {
  const { chatRoomId, customer } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [chatRoomId]);

  const fetchMessages = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`https://leen-app.com/public/api/seller/chat/messages/${chatRoomId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isSender = item.sender_type === "App\\Models\\Sellers\\Seller";
    return (
      <View style={[
        styles.messageContainer,
        isSender ? styles.sentMessage : styles.receivedMessage
      ]}>
        <Text style={isSender ? styles.messageText : styles.receivedMessageText}>{item.message}</Text>
      </View>
    );
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        'https://leen-app.com/public/api/seller/chat/sendMessage',
        {
          chat_room_id: chatRoomId,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={styles.headerTitle}>{customer.first_name + ' ' + customer.last_name}</Text>
          <Image source={ChatImg} style={{ width: 40, height: 40 }} />
          <Icon name="chevron-right" size={26} color="#000" onPress={() => navigation.goBack()} />
        </View>
        <TouchableOpacity>
          <Icon name="dots-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        {/* Emoji Button */}
        <TouchableOpacity>
          <Icon name="emoticon-outline" size={28} color="#56766F" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="اكتب رسالة..."
          value={newMessage}
          onChangeText={setNewMessage}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send-circle" size={45} color="#56766F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#435E58',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#EAECF4',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  receivedMessageText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'AlmaraiRegular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#F6F6F6',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#F5F6F7',
    fontFamily: 'AlmaraiRegular',
  },
});

export default ChatRoom;
