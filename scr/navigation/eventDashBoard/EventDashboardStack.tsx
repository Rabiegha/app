// EventStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionListScreen from '../../screens/session/SessionListScreen';
import AllAttendeesListScreen from '../../screens/attendeeList/attendeeListScreen';
import EventDashboardScreen from '../../screens/eventDashboard/EventDashboardScreen';

const Stack = createNativeStackNavigator();

const EventDashboardStackNavigator = ({ searchQuery }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs inside the stack */}
      <Stack.Screen name="EventDashboard" component={EventDashboardScreen} />
      {/* Extra screens not in tabs */}
      <Stack.Screen name="AttendeeList" component={AllAttendeesListScreen} />
      <Stack.Screen name="SessionDetails" component={SessionListScreen} />
    </Stack.Navigator>
  );
}
export default EventDashboardStackNavigator;
