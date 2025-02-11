import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import TapNavigation from '../components/TapNavigation';
const calendarIcon = require('../assets/images/avatars/calendar.png');

const dayTranslations = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة',
};

const Timetable = ({ navigation }) => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        'https://leen-app.com/public/api/seller/timetables',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTimetables(data.timetables);
    } catch (error) {
      Alert.alert('خطاء', 'فضل في تحميل جدول المواعيد');
      console.error('Error fetching timetables:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkDay = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        'https://leen-app.com/public/api/seller/timetables/store',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedTimetable),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert('تم الحفظ', 'تم حفظ يوم العمل بنجاح');
      fetchTimetables(); // Refresh the timetable list
      setModalVisible(false);
      setSelectedTimetable(null);
    } catch (error) {
      Alert.alert('خطأ', 'فشل حفظ يوم العمل');
      console.error('Error adding work day:', error);
    }
  };

  const updateTimetable = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        `https://leen-app.com/public/api/seller/timetables/update/${selectedTimetable.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedTimetable),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert('تم التحديث', 'تم تحديث يوم العمل بنجاح' ,[{ text: 'حسنا'}]);
      fetchTimetables(); // Refresh the timetable list
      setModalVisible(false);
      setSelectedTimetable(null);
    } catch (error) {
      Alert.alert('خطأ', 'فشل تحديث يوم العمل');
      console.error('Error updating timetable:', error);
    }
  };

  const handleDeleteTimetable = async (id) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد أنك تريد حذف هذا اليوم من جدول المواعيد؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              const response = await fetch(
                `https://leen-app.com/public/api/seller/timetables/destroy/${id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
  
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
  
              Alert.alert('تم الحذف', 'تم حذف اليوم من جدول المواعيد بنجاح');
              fetchTimetables(); // Refresh the timetable list
            } catch (error) {
              Alert.alert('خطأ', 'فشل حذف اليوم من جدول المواعيد');
              console.error('Error deleting timetable:', error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  const renderTimetableCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={calendarIcon} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardDay}>{dayTranslations[item.day] || item.day}</Text>
        <Text style={styles.cardTime}>
          من {item.start_time} الي {item.end_time}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTimetable(item); // Set the selected timetable for editing
            setModalVisible(true); // Show the modal for editing
          }}
        >
          <Icon name="edit" size={20} color="#2f3e3b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTimetable(item.id)}>
          <Icon name="trash" size={20} color="#ff0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2f3e3b" />
      ) : (
        <FlatList
          data={timetables}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTimetableCard}
          contentContainerStyle={styles.listContainer}
        />
      )}

<TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedTimetable({ day: '', start_time: '', end_time: '' });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>إضافة يوم عمل</Text>
      </TouchableOpacity>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedTimetable?.id ? 'تعديل يوم العمل' : 'إضافة يوم عمل'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="اليوم (مثل: الأحد)"
              value={selectedTimetable?.day || ''}
              onChangeText={(text) =>
                setSelectedTimetable({ ...selectedTimetable, day: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="وقت البداية (مثل: 09:00)"
              value={selectedTimetable?.start_time || ''}
              onChangeText={(text) =>
                setSelectedTimetable({ ...selectedTimetable, start_time: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="وقت النهاية (مثل: 17:00)"
              value={selectedTimetable?.end_time || ''}
              onChangeText={(text) =>
                setSelectedTimetable({ ...selectedTimetable, end_time: text })
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  selectedTimetable?.id ? updateTimetable() : addWorkDay();
                }}
              >
                <Text style={styles.buttonText}>حفظ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedTimetable(null);
                }}
              >
                <Text style={styles.buttonText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: 'rtl',
  },
  addButton: {
    backgroundColor: '#435E58',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
    borderRightWidth: 7,
    borderRightColor: '#435E58',
  },
  cardImage: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardDay: {
    fontSize: 16,
    fontFamily: 'AlmaraiBold',
    color: '#2f3e3b',
    marginBottom: 5,
  },
  cardTime: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'AlmaraiRegular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#2f3e3b',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f08b47',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 10,
    gap: 20,
  },
  actionIcon: {
    fontSize: 18,
    color: '#2f3e3b',
    marginHorizontal: 5,
  },
});

export default Timetable;
