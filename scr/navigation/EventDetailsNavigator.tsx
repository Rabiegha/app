import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventDetailsPerTypeScreen from '../screens/EventDetailsPerType';
import EventDetailsScreen from '../screens/EventDetails';

const MenuStack = createNativeStackNavigator();

export default function EventDetailsNavigator() {
  return (
    <MenuStack.Navigator
      screenOptions={{headerShown: false}}>
      <MenuStack.Screen name="EventDetails" component={EventDetailsScreen} />
      <MenuStack.Screen name="EventDetailsPerTypeScreen" component={EventDetailsPerTypeScreen} />
    </MenuStack.Navigator>
  );
}
