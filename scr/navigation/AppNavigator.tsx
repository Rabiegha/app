import React, {useContext} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {AuthContext} from '../context/AuthContext';
import ConnexionScreen from '../screens/auth/ConnexionScreen';
import EventsScreen from '../screens/event/EventsScreen';
import MoreScreen from '../screens/attendeeDetails/MoreScreen';
import EditScreen from '../screens/attendeeDetails/EditScreen';
import BadgeScreen from '../screens/attendeeDetails/BadgeScreen';
import PrintresListScreen from '../screens/print/PrintersListScreen';
import PaperFormat from '../screens/print/PaperFormatScreen';
import WebViewScreen from '../screens/menu/WebViewScreen';
import FutureEventsScreen from '../screens/event/FutureEventsScreen';
import PastEventsScreen from '../screens/event/PastEventsScreen';
import TabNavigator from './tabNavigator/TabNavigator';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../redux/selectors/auth/authSelectors';
import SessionAttendeesListScreen from '../screens/sessionAttendeesList/SessionAttendeesListScreen';
import SessionScanScreen from '../screens/sessionsScan/SessionScanScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const {isDemoMode} = useContext(AuthContext);
  const userId = useSelector(selectCurrentUserId);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {userId || isDemoMode ? (
        <Stack.Screen name="Events" component={EventsScreen} />
      ) : (
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
      )}
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="SessionAttendeesList" component={SessionAttendeesListScreen} />
      <Stack.Screen name="SessionsScanScreen" component={SessionScanScreen} />
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="Badge" component={BadgeScreen} />
      <Stack.Screen name="Printers" component={PrintresListScreen} />
      <Stack.Screen name="PaperFormat" component={PaperFormat} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="Avenir" component={FutureEventsScreen} />
      <Stack.Screen name="Passees" component={PastEventsScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
