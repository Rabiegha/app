import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MenuScreen from '../screens/Menu';
import HelpScreen from '../screens/Help';
import AboutScreen from '../screens/About';
import SearchSettingsScreen from '../screens/SearchSettings';
import ScanSettingsScreen from '../screens/ScanSettings';
import EventDetailsNavigator from './EventDetailsNavigator';

const MenuStack = createNativeStackNavigator();

export default function MenuNavigator() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MainMenu" component={MenuScreen} />
      <MenuStack.Screen name="Help" component={HelpScreen} />
      <MenuStack.Screen name="About" component={AboutScreen} />
      <MenuStack.Screen name="SearchSettings" component={SearchSettingsScreen} />
      <MenuStack.Screen name="EventDetails" component={EventDetailsNavigator} />
      <MenuStack.Screen name="ScanSettings" component={ScanSettingsScreen} />
    </MenuStack.Navigator>
  );
}
