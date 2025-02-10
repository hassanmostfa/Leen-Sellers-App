import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';

const getCurrentWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const weekDates = [];
  for (let i = 0; i < 8; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push({
      date: date.toISOString(),
      dayNumber: date.getDate(),
      dayName: format(date, 'EEE'),
    });
  }
  return weekDates;
};

const Schedule = ({ bookings = [] }) => {
  const today = new Date().toISOString();
  const [selectedDate, setSelectedDate] = useState(today);
  const currentWeekDates = getCurrentWeekDates();

  const currentWeekBookings = bookings.filter((booking) =>
    currentWeekDates.some((day) => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      const weekDate = new Date(day.date).toISOString().split('T')[0];
      return bookingDate === weekDate;
    })
  );

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 24; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
    }
    for (let hour = 1; hour < 9; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getBookingInfo = (date, time) => {
    return currentWeekBookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      const selectedDateFormatted = new Date(date).toISOString().split('T')[0];
      return bookingDate === selectedDateFormatted && booking.time === time;
    });
  };

  const renderDateItem = ({ item }) => {
    const isSelected =
      new Date(selectedDate).toISOString().split('T')[0] ===
      new Date(item.date).toISOString().split('T')[0];

    return (
      <TouchableOpacity
        style={styles.dateItem}
        onPress={() => setSelectedDate(item.date)}
      >
        <View
          style={[
            styles.dayNumberContainer,
            isSelected && styles.selectedDayNumberContainer,
          ]}
        >
          <Text
            style={[
              styles.dayNumber,
              isSelected && styles.selectedDayNumber,
            ]}
          >
            {item.dayNumber}
          </Text>
        </View>
        <Text style={styles.dayName}>
          {item.dayName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeSlot = (time) => {
    const bookingInfos = getBookingInfo(selectedDate, time);

    return (
      <View style={styles.timeSlotRow}>
        <Text style={styles.timeText}>{time}</Text>
        <View style={styles.bookingCellsContainer}>
          {bookingInfos.length > 0 ? (
            bookingInfos.map((bookingInfo, index) => (
              <View
                key={index}
                style={[
                  styles.bookingCell,
                  styles.bookedCell,
                ]}
              >
                <View style={styles.bookingInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.bookingText}>
                      {bookingInfo.customerName || 'Unknown Customer'}
                    </Text>
                    <Text style={styles.separator}> | </Text>
                    <Text style={styles.employeeText}>
                      {bookingInfo.employeeName || 'Unknown Employee'}
                    </Text>
                  </View>
                  <Text style={styles.serviceText}>
                    {bookingInfo.serviceName || 'Unknown Service'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.bookingCell}>
              {/* Empty cell content (optional) */}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.scheduleContainer}>
      <FlatList
        horizontal
        data={currentWeekDates}
        renderItem={renderDateItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.datesRow}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={timeSlots}
        renderItem={({ item }) => renderTimeSlot(item)}
        keyExtractor={(item) => item}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleContainer: {
    flex: 6,
    padding: 10,
  },
  datesRow: {
    paddingVertical: 10,
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dayNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedDayNumberContainer: {
    backgroundColor: '#435E58',
    borderRadius: 20,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'AlmaraiBold',
    color: '#000',
  },
  selectedDayNumber: {
    color: '#fff',
  },
  dayName: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'AlmaraiRegular',
    marginTop: 5,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  timeText: {
    width: 80,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'AlmaraiRegular',
  },
  bookingCellsContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  bookingCell: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderLeftWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  bookedCell: {
    backgroundColor: '#435E58',
    borderColor: '#435E58',
    height: 60,
  },
  bookingInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'AlmaraiRegular',
  },
  separator: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'AlmaraiRegular',
    marginHorizontal: 5,
  },
  employeeText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'AlmaraiRegular',
  },
  serviceText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 5,
    fontFamily: 'AlmaraiRegular',
  },
});

export default Schedule;