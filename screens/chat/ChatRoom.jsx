import { View, Text } from 'react-native'
import React from 'react'

const ChatRoom = ({ route}) => {
    const  roomId  = route.params;
  return (
    <View style={{ flex: 1 , justifyContent: 'center' , alignItems: 'center' }}>
      <Text>Messages here</Text>
      <Text>Chat Room ID: {roomId}</Text>
    </View>
  )
}

export default ChatRoom