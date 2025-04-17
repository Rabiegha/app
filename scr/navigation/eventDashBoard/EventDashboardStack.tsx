// EventStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionListAttendeesScreen from '../../screens/session/SessionAttendeesListScreen';
import attendeesListScreen from '../../screens/attendeeList/attendeeListScreen';
import EventDashboardScreen from '../../screens/eventDashboard/EventDashboardScreen';

const Stack = createNativeStackNavigator();

const EventDashboardStackNavigator = ({ searchQuery }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs inside the stack */}
      <Stack.Screen name="EventDashboard" component={EventDashboardScreen} />
      {/* Extra screens not in tabs */}
      <Stack.Screen name="AttendeeList" component={attendeesListScreen} />
      <Stack.Screen name="SessionAttendeesList" component={SessionListAttendeesScreen} />
    </Stack.Navigator>
  );
}
export default EventDashboardStackNavigator;
