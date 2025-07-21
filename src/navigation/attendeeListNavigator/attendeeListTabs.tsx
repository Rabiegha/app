import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import colors from '@/assets/colors/colors';
import EventDetailsScreen from '@/screens/eventDetails/EventDetailsScreen';
import AttendeeListScreen from '@/screens/attendeesList/attendeesListScreen';

const Tab = createMaterialTopTabNavigator();

const AttendeeListDashboardScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Guest Lists"
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
      <Tab.Screen name="Guest Lists" component={AttendeeListScreen} />
      <Tab.Screen name="Event Details" component={EventDetailsScreen} />
    </Tab.Navigator>
  );
};

export default AttendeeListDashboardScreen;
