import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import EventPasseesScreen from '../screens/event/PastEventsScreen';
import EventAvenirScreen from '../screens/event/FutureEventsScreen';
import colors from '../assets/colors/colors';
import CustomTabBar from '../components/navigation/CustomTabBar';

const Tab = createMaterialTopTabNavigator();

export default function TabsNavigator({searchQuery, onEventSelect}) {
  return (
    <Tab.Navigator
      initialRouteName="A venir"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.grey,
        tabBarIndicatorStyle: {
          backgroundColor: colors.green,
          height: 6,
          borderRadius: 15,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          elevation: 0,
          marginHorizontal: 20,
        },
        tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
        tabBarPressColor: 'transparent',
      }}>
      <Tab.Screen name="A venir">
        {() => (
          <EventAvenirScreen
            searchQuery={searchQuery}
            onEventSelect={onEventSelect}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Passées">
        {() => (
          <EventPasseesScreen
            searchQuery={searchQuery}
            onEventSelect={onEventSelect}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
