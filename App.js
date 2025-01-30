import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native'; // Correct import
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Correct import
import Welcome from './screens/Welcome';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import Employees from './screens/employees/Employees';
import AddEmployee from './screens/employees/AddEmployee';
import EditEmployee from './screens/employees/EditEmployee';
import RegisterForm from './components/RegisterForm';
import Timetable from './screens/Timetable';
import HomeServices from './screens/services/HomeServices';
import ShowHomeService from './screens/services/ShowHomeService';
import AddHomeService from './screens/services/AddHomeService';
import UpdateHomeService from './screens/services/UpdateHomeService';
import StudioServices from './screens/services/StudioServices';
import ShowStudioService from './screens/services/ShowStudioService';
import AddStudioService from './screens/services/AddStudioService';
import UpdateStudioService from './screens/services/UpdateStudioService';
import HomeBookings from './screens/bookings/HomeBookings';
import StudioBookings from './screens/bookings/StudioBookings';
import ShowHomeBooking from './screens/bookings/ShowHomeBooking';
import ShowStudioBooking from './screens/bookings/ShowStudioBooking';
import Gallery from './screens/Media/Gallery';
import Reels from './screens/Media/Reels';
import Coupons from './screens/coupons/Coupons';
import AddCoupon from './screens/coupons/AddCoupon';
import UpdateCoupon from './screens/coupons/UpdateCoupon';
import Customers from './screens/chat/Customers';
import ChatRoom from './screens/chat/ChatRoom';
import Notifications from './screens/Notifications';
import More from './screens/More';

// Main App Component
export default function App() {
// Fonts
const [loaded] = useFonts({
  AlmaraiBold: require('./assets/fonts/Almarai-Bold.ttf'),
  AlmaraiExtraBold: require('./assets/fonts/Almarai-ExtraBold.ttf'),
  AlmaraiLight: require('./assets/fonts/Almarai-Light.ttf'),
  AlmaraiRegular: require('./assets/fonts/Almarai-Regular.ttf'),
});

  if (!loaded) {
    return null;
  }

  const Stack = createNativeStackNavigator(); // Initialize Stack Navigator


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="RegisterForm" component={RegisterForm} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Employees" component={Employees} />
        <Stack.Screen name="AddEmployee" component={AddEmployee} />
        <Stack.Screen name="EditEmployee" component={EditEmployee} />
        <Stack.Screen name="Timetable" component={Timetable} />
        <Stack.Screen name="HomeServices" component={HomeServices} />
        <Stack.Screen name="ShowHomeService" component={ShowHomeService} />
        <Stack.Screen name="AddHomeService" component={AddHomeService} />
        <Stack.Screen name="UpdateHomeService" component={UpdateHomeService} />
        <Stack.Screen name="StudioServices" component={StudioServices} />
        <Stack.Screen name="ShowStudioService" component={ShowStudioService} />
        <Stack.Screen name="AddStudioService" component={AddStudioService} />
        <Stack.Screen name="UpdateStudioService" component={UpdateStudioService} />
        <Stack.Screen name="HomeBookings" component={HomeBookings} />
        <Stack.Screen name="ShowHomeBooking" component={ShowHomeBooking} />
        <Stack.Screen name="StudioBookings" component={StudioBookings} />
        <Stack.Screen name="ShowStudioBooking" component={ShowStudioBooking} />
        <Stack.Screen name="Gallery" component={Gallery} />
        <Stack.Screen name="Reels" component={Reels} />
        <Stack.Screen name="Coupons" component={Coupons} />
        <Stack.Screen name="AddCoupon" component={AddCoupon} />
        <Stack.Screen name="UpdateCoupon" component={UpdateCoupon} />
        <Stack.Screen name="Customers" component={Customers} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="More" component={More} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
