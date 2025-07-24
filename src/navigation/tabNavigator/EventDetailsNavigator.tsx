import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventDetailsPerTypeScreen from '../../screens/eventDetails/EventDetailsPerTypeScreen';
import EventDetailsScreen from '../../screens/eventDetails/EventDetailsScreen';

// Define the type for the EventDetails navigation stack
export type EventDetailsStackParamList = {
  EventDetailsScreen: undefined;
  EventDetailsPerTypeScreen: { state: string | null; total: number | null };
};

const Stack = createNativeStackNavigator<EventDetailsStackParamList>();

export default function EventDetailsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
      <Stack.Screen name="EventDetailsPerTypeScreen" component={EventDetailsPerTypeScreen} />
    </Stack.Navigator>
  );
}
