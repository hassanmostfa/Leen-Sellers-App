import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeServiceCard from '../../components/services/Home/HomeServiceCard';

const HomeServices = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          console.error('Auth token not found');
          setLoading(false);
          return;
        }

        const response = await fetch('https://leen-app.com/public/api/seller/homeServices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setServices(data.data);
          setFilteredServices(data.data);

          const serviceCategories = data.data.map(service => service.category?.name).filter((value, index, self) => self.indexOf(value) === index);
          setCategories(['all', ...serviceCategories]);
        } else {
          console.error('Failed to fetch services:', data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, services]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service?.name?.toLowerCase().includes(query.toLowerCase()) ||
        service?.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service => service.category?.name === category);
      setFilteredServices(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-right" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الخدمات المنزلية</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddHomeService')} style={styles.addButton}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>قائمة الخدمات المنزلية</Text>
        <Text style={styles.description}>عرض وإدارة قائمة الخدمات المنزلية التي يقدمها عملك</Text>

        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="بحث عن الخدمة"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.categoriesContainer}>
  {categories.map((category, index) => {
    const serviceCount = category === 'all' ? services.length : 0; // Show count only for "جميع الخدمات"

    return (
      <TouchableOpacity 
        key={category} 
        style={[styles.categoryLink, activeCategory === category && styles.activeCategory]} 
        onPress={() => handleCategoryFilter(category)}
      >
        <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
          {category === 'all' ? 'جميع الخدمات' : category}  
        </Text>
        {index === 0 && ( // Show badge only for the first item
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{serviceCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  })}
</View>

      </View>

      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HomeServiceCard navigation={navigation} item={item} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>لا يوجد خدمات</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'AlmaraiBold',
  },
  addButton: {
    backgroundColor: '#435E58',
    padding: 8,
    borderRadius: 50,
  },
  descriptionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'AlmaraiBold',
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    fontFamily: 'AlmaraiRegular',
    textAlign: 'right',
    color: '#999999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'AlmaraiRegular',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
  },
  categoriesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryLink: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 50,
  },
  activeCategory: {
    backgroundColor: '#435E58',
  },
  categoryText: {
    fontSize: 15,
    fontFamily: 'AlmaraiBold',
  },
  activeCategoryText: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 8,
    marginRight: 5,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'AlmaraiBold',
  },
});

export default HomeServices;
