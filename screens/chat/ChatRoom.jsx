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
import ChatImg from '../../assets/images/avatars/chat.png';
import moment from 'moment';
import Pusher from 'pusher-js/react-native';

const ChatRoom = ({ route, navigation }) => {
  const { chatRoomId, customer } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [chatRoomId]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }
  }, [messages]);

  useEffect(() => {
    const setupPusher = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          console.error('No auth token found!');
          return;
        }

        Pusher.logToConsole = true;

        const pusher = new Pusher('02c14683a1bbc058e455', {
          cluster: 'eu',
          authEndpoint: 'https://leen-app.com/public/api/broadcasting/auth',
          auth: {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        });

        pusher.connection.bind('connected', () => {
          console.log('Pusher Connected');
        });

        const channel = pusher.subscribe(`private-chat-room.${chatRoomId}`);

        channel.bind('new-message', (data) => {
          console.log('New message received:', data);
          
          if (!data || !data.message) {
            console.error('Invalid message data:', data);
            return;
          }

          setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        return () => {
          channel.unbind_all();
          channel.unsubscribe();
          pusher.disconnect();
        };
      } catch (error) {
        console.error('Error setting up Pusher:', error);
      }
    };

    setupPusher();
  }, [chatRoomId]);

  const fetchMessages = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(
        `https://leen-app.com/public/api/seller/chat/messages/${chatRoomId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const formatDate = (date) => {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const messageDate = moment(date).format('YYYY-MM-DD');

    if (messageDate === today) return 'اليوم';
    if (messageDate === yesterday) return 'الأمس';
    return moment(date).format('DD/MM/YYYY');
  };

  const renderMessage = ({ item, index }) => {
    console.log("Rendering message:", item);
    if (!item || !item.message) return null;

    const isSender = item.sender_type === "App\\Models\\Sellers\\Seller";
    const currentMessageDate = moment(item.created_at).format('YYYY-MM-DD');
    const previousMessageDate = index > 0 ? moment(messages[index - 1].created_at).format('YYYY-MM-DD') : null;

    return (
      <>
        {index === 0 || currentMessageDate !== previousMessageDate ? (
          <View style={styles.dateContainer}>
            <View style={styles.line} />
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
            <View style={styles.line} />
          </View>
        ) : null}

        <View style={[
          styles.messageContainer,
          isSender ? styles.sentMessage : styles.receivedMessage
        ]}>
          <Text style={isSender ? styles.messageText : styles.receivedMessageText}>
            {item.message}
          </Text>
        </View> 
      </>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={styles.headerTitle}>
            {customer.first_name + ' ' + customer.last_name}
          </Text>
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
      renderItem={renderMessage}
      keyExtractor={(item, index) => item.id ? item.id.toString() : `message-${index}`}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    />


      {/* Message Input */}
      <View style={styles.inputContainer}>
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

export default ChatRoom;


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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e7e7e7',
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#555',
    fontFamily: 'AlmaraiBold',
  },
});

