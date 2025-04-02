// EventStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionListScreen from '../../screens/SessionList';
import AllAttendeesListScreen from '../../screens/AllAttendeesListScreen';
import EventDashboardTabsNavigator from './EventDashBoardTabsNavigator';
import EventDashboardScreen from '../../screens/dashboard/EventDashboardScreen';

const Stack = createNativeStackNavigator();

const EventDashboardStackNavigator = ({ searchQuery }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs inside the stack */}
      <Stack.Screen name="EventDashboard" component={EventDashboardScreen} />
      {/* Extra screens not in tabs */}
      <Stack.Screen name="AllAttendeesList" component={AllAttendeesListScreen} />
      <Stack.Screen name="SessionDetails" component={SessionListScreen} />
    </Stack.Navigator>
  );
}
export default EventDashboardStackNavigator;
