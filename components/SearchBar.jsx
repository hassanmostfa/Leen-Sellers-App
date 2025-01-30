import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <Icon name="search-outline" size={24} color="#aaa" style={styles.icon} />

      {/* Text Input */}
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        placeholder="ابحث هنا..."
        placeholderTextColor="#aaa"
      />

      {/* Clear Button */}
      {searchText.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2f3e3bmmvm',
  },
  clearButton: {
    marginLeft: 8,
  },
});

export default SearchBar;
