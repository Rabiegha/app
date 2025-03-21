import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import EventDetailsPerTypeScreen from '../screens/EventDetailsPerType';
import EventDetailsScreen from '../screens/EventDetails';

const MenuStack = createStackNavigator();

export default function EventDetailsNavigator() {
  return (
    <MenuStack.Navigator
      initialRouteName="EventDetails"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#000' },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
            open: { animation: 'timing', config: { duration: 200 } }, // Smooth open
            close: { animation: 'timing', config: { duration: 350 } }, // Smooth close
          },

      }}
    >
      <MenuStack.Screen name="EventDetails" component={EventDetailsScreen} />
      <MenuStack.Screen name="EventDetailsPerTypeScreen" component={EventDetailsPerTypeScreen} />
    </MenuStack.Navigator>
  );
}
