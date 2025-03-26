import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EventDashboardScreen from '../screens/EventDashboardScreen';
import AttendeesScreen from '../screens/Attendees'; // optional, if you still want to navigate to it

const Stack = createNativeStackNavigator();

export default function AttendeesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={EventDashboardScreen} />
      <Stack.Screen name="Attendees" component={AttendeesScreen} />
    </Stack.Navigator>
  );
}
