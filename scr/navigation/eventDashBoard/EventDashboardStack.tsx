// EventStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AttendeesListScreen from '../../screens/attendeesList/attendeesListScreen';
import EventDashboardScreen from '../../screens/eventDashboard/EventDashboardScreen';
import SessionAttendeesListScreen from '../../screens/sessionAttendeesList/SessionAttendeesListScreen';

const Stack = createNativeStackNavigator();

const EventDashboardStackNavigator = ({ searchQuery }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs inside the stack */}
      <Stack.Screen name="EventDashboard" component={EventDashboardScreen} />
      {/* Extra screens not in tabs */}
      <Stack.Screen name="AttendeesList" component={AttendeesListScreen} />
      <Stack.Screen name="SessionAttendeesList" component={SessionAttendeesListScreen} />
    </Stack.Navigator>
  );
}
export default EventDashboardStackNavigator;
