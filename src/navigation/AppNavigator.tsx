import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import ConnexionScreen from '../screens/auth/ConnexionScreen';
import EventsScreen from '../screens/event/EventsScreen';
import MoreScreen from '../screens/attendeeDetails/MoreScreen';
import BadgeScreen from '../screens/attendeeDetails/BadgeScreen';
import PrintresListScreen from '../screens/print/PrintersListScreen';
import PaperFormat from '../screens/print/PaperFormatScreen';
import WebViewScreen from '../screens/menu/WebViewScreen';
import FutureEventsScreen from '../screens/event/FutureEventsScreen';
import PastEventsScreen from '../screens/event/PastEventsScreen';
import {selectCurrentUserId, selectUserType} from '../redux/selectors/auth/authSelectors';
import SessionAttendeesListScreen from '../screens/sessionAttendeesList/SessionAttendeesListScreen';
import ScanScreen from '../screens/scanScreen/ScanScreen';
import ProfileScreen from '../screens/profil/Profil';

import PartnerTabNavigator from './tabNavigator/partnerTabNavigator/PartnerTabNavigator';
import TabNavigator from './tabNavigator/TabNavigator';
import EventDetailsNavigator from './tabNavigator/EventDetailsNavigator';
import EventDetailsPerTypeScreen from '@/screens/eventDetails/EventDetailsPerTypeScreen';

// Define the navigation stack param list type
export type RootStackParamList = {
  Connexion: undefined;
  Events: undefined;
  Tabs: undefined;
  SessionAttendeesList: undefined;
  More: { attendeeId: string; comment?: string; eventId?: string };
  Badge: { attendeeId: string; eventId: string; badgePdfUrl: string; badgeImageUrl: string };
  ScanScreen: undefined;
  Printers: undefined;
  PaperFormat: undefined;
  WebView: undefined;
  Avenir: undefined;
  Passees: undefined;
  Profil: undefined;
  EventDetailsNavigator: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const userId = useSelector(selectCurrentUserId);
  const userType = useSelector(selectUserType);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {userId ? (
        <Stack.Screen name="Events" component={EventsScreen} />
      ) : (
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
      )}
        <Stack.Screen
        name="Tabs"
        component={userType === 'Partner' ? PartnerTabNavigator : TabNavigator}
      />
      <Stack.Screen name="SessionAttendeesList" component={SessionAttendeesListScreen} />
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Badge" component={BadgeScreen} />
      <Stack.Screen name="ScanScreen" component={ScanScreen} />
      <Stack.Screen name="Printers" component={PrintresListScreen} />
      <Stack.Screen name="PaperFormat" component={PaperFormat} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="Avenir" component={FutureEventsScreen} />
      <Stack.Screen name="Passees" component={PastEventsScreen} />
      <Stack.Screen name="Profil" component={ProfileScreen} />
      <Stack.Screen name="EventDetailsNavigator" component={EventDetailsNavigator} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
