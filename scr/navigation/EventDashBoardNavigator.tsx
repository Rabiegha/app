import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../assets/colors/colors';
import AttendeeListScreen from '../screens/AttendeeListScreen';
import SessionsListScreen from '../screens/SessionsListScreen';

const Tab = createMaterialTopTabNavigator();

export default function EventDashboardNavigator({searchQuery}) {
  return (
    <Tab.Navigator
      initialRouteName="Guest Lists"
      screenOptions={{
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.grey,
        tabBarIndicatorStyle: {
          height: 0,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          elevation: 0,
          marginHorizontal: 30,
          marginTop: 10,
          borderRadius: 12,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          flex: 1,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 13,
          textTransform: 'none',
        },
        tabBarPressColor: 'transparent',
        tabBarIndicatorContainerStyle: {
          borderRadius: 15,
        },
      }}>
      <Tab.Screen name="Guest Lists">
        {() => <AttendeeListScreen searchQuery={searchQuery} />}
      </Tab.Screen>
      <Tab.Screen name="Sessions">
        {() => <SessionsListScreen searchQuery={searchQuery} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
