import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MenuScreen from '../../screens/menu/MenuScreen';
import HelpScreen from '../../screens/menu/HelpScreen';
import AboutScreen from '../../screens/menu/AboutScreen';
import SearchSettingsScreen from '../../screens/settings/SearchSettingsScreen';
import ScanSettingsScreen from '../../screens/settings/ScanSettingsScreen';
import EventDetailsNavigator from '../tabNavigator/EventDetailsNavigator';

const MenuStack = createNativeStackNavigator();

export default function MenuNavigator() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MainMenu" component={MenuScreen} />
      <MenuStack.Screen name="Help" component={HelpScreen} />
      <MenuStack.Screen name="About" component={AboutScreen} />
      <MenuStack.Screen name="SearchSettings" component={SearchSettingsScreen} />
      <MenuStack.Screen name="EventDetailsNavigator" component={EventDetailsNavigator} />
      <MenuStack.Screen name="ScanSettings" component={ScanSettingsScreen} />
    </MenuStack.Navigator>
  );
}
