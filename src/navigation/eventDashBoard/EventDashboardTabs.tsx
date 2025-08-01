import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import colors from '../../assets/colors/colors';
import AttendeeOverviewScreen from '../../screens/eventDashboard/AttendeeOverviewScreen';
import SessionOverviewScreen from '../../screens/eventDashboard/SessionOverviewScreen';
import CustomTabBar from '../../components/navigation/CustomTabBar';

const Tab = createMaterialTopTabNavigator();

const EventDashboardTabsNavigator = ({searchQuery}: {searchQuery: string}) => {
  return (
    <Tab.Navigator
      initialRouteName="Guest Lists"
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
      <Tab.Screen
        name="GuestLists"
        component={AttendeeOverviewScreen}
        initialParams={{ searchQuery }}
      />
      <Tab.Screen
        name="Sessions"
        component={SessionOverviewScreen}
        initialParams={{ searchQuery }}
      />
    </Tab.Navigator>
  );
}

export default EventDashboardTabsNavigator;
