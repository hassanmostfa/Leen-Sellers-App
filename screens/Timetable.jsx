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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";


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

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  return new Date(0, 0, 0, hours, minutes - 5).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Convert to AM/PM format
  });
};

const Timetable = ({ navigation }) => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [startPickerVisible, setStartPickerVisible] = useState(false);
const [endPickerVisible, setEndPickerVisible] = useState(false);

const showStartPicker = () => setStartPickerVisible(true);
const hideStartPicker = () => setStartPickerVisible(false);
const showEndPicker = () => setEndPickerVisible(true);
const hideEndPicker = () => setEndPickerVisible(false);

const handleConfirmStartTime = (time) => {
  setSelectedTimetable((prev) => ({
    ...prev,
    start_time: moment(time).format("HH:mm"),
  }));
  hideStartPicker();
};

const handleConfirmEndTime = (time) => {
  setSelectedTimetable((prev) => ({
    ...prev,
    end_time: moment(time).format("HH:mm"),
  }));
  hideEndPicker();
};

const weekDays = [
  { label: 'الأحد', value: 'Sunday' },
  { label: 'الإثنين', value: 'Monday' },
  { label: 'الثلاثاء', value: 'Tuesday' },
  { label: 'الأربعاء', value: 'Wednesday' },
  { label: 'الخميس', value: 'Thursday' },
  { label: 'الجمعة', value: 'Friday' },
  { label: 'السبت', value: 'Saturday' },
];

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
          من {formatTime(item.start_time)} الي {formatTime(item.end_time)}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTimetable(item);
            setModalVisible(true);
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
            {selectedTimetable?.id ? "تعديل يوم العمل" : "إضافة يوم عمل"}
          </Text>

          {/* Day Selection */}
          <Text style={styles.label}>اختر اليوم:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTimetable?.day || ""}
              onValueChange={(itemValue) =>
                setSelectedTimetable({ ...selectedTimetable, day: itemValue })
              }
              style={styles.picker}
            >
              {weekDays.map((day) => (
                <Picker.Item key={day.value} label={day.label} value={day.value} />
              ))}
            </Picker>
          </View>

          {/* Time Pickers */}
          <Text style={styles.label}>وقت العمل:</Text>
          <View style={styles.timeRow}>
            <TouchableOpacity style={styles.timePicker} onPress={showStartPicker}>
              <Text style={styles.timeText}>
                {selectedTimetable?.start_time || "اختر وقت البداية"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.timePicker} onPress={showEndPicker}>
              <Text style={styles.timeText}>
                {selectedTimetable?.end_time || "اختر وقت النهاية"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Start Time Picker */}
          <DateTimePickerModal
            isVisible={startPickerVisible}
            mode="time"
            is24Hour={true}
            onConfirm={handleConfirmStartTime}
            onCancel={hideStartPicker}
          />

          {/* End Time Picker */}
          <DateTimePickerModal
            isVisible={endPickerVisible}
            mode="time"
            is24Hour={true}
            onConfirm={handleConfirmEndTime}
            onCancel={hideEndPicker}
          />

          {/* Buttons */}
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
              <Text style={styles.cancelButtonText}>إلغاء</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "AlmaraiBold",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "AlmaraiRegular",
    marginBottom: 5,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "AlmaraiRegular",
  },
  modalButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: "#435E58",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#435E58",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "AlmaraiBold",
  },
  cancelButtonText: {
    color: "#435E58",
    fontFamily: "AlmaraiBold",
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
