import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import MenuScreen from '../screens/Menu';
import HelpScreen from '../screens/Help';
import AboutScreen from '../screens/About';
import SearchSettingsScreen from '../screens/SearchSettings';
import ScanSettingsScreen from '../screens/ScanSettings';
import EventDetailsScreen from '../screens/EventDetails';

const MenuStack = createStackNavigator();

export default function MenuNavigator() {
  return (
    <MenuStack.Navigator
      initialRouteName="MainMenu"
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
      <MenuStack.Screen name="MainMenu" component={MenuScreen} />
      <MenuStack.Screen name="Help" component={HelpScreen} />
      <MenuStack.Screen name="About" component={AboutScreen} />
      <MenuStack.Screen name="SearchSettings" component={SearchSettingsScreen} />
      <MenuStack.Screen name="EventDetails" component={EventDetailsScreen} />
      <MenuStack.Screen name="ScanSettings" component={ScanSettingsScreen} />
    </MenuStack.Navigator>
  );
}
