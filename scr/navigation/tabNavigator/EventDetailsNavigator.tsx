import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventDetailsPerTypeScreen from '../../screens/eventDetails/EventDetailsPerTypeScreen';
import EventDetailsScreen from '../../screens/eventDetails/EventDetailsScreen';

const stack = createNativeStackNavigator();

export default function EventDetailsNavigator() {
  return (
    <stack.Navigator
      screenOptions={{headerShown: false}}>
      <stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <stack.Screen name="EventDetailsPerType" component={EventDetailsPerTypeScreen} />
    </stack.Navigator>
  );
}
