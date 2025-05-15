// EventStackNavigator.ts
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AttendeesListScreen from '../../screens/attendeesList/attendeesListScreen';
import EventDashboardScreen from '../../screens/eventDashboard/EventDashboardScreen';

const Stack = createNativeStackNavigator();

const EventDashboardStackNavigator = ({ searchQuery }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs inside the stack */}
      <Stack.Screen name="EventDashboard" component={EventDashboardScreen} />
      {/* Extra screens not in tabs */}
      <Stack.Screen name="AttendeesList" component={AttendeesListScreen} />
    </Stack.Navigator>
  );
}
export default EventDashboardStackNavigator;
