import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform, StatusBar} from 'react-native';
import {NavigationContainer, useFocusEffect, useNavigation} from '@react-navigation/native';
import HeaderEvent from '../../components/elements/header/HeaderEvent';
import Search from '../../components/elements/Search';

import globalStyle from '../../assets/styles/globalStyle';
import {useEvent} from '../../context/EventContext';
import useStatusBarStyle from '../../hooks/useStatusBarStyle';
import EventDashBoardTabsNavigator from '../../navigation/eventDashBoard/EventDashboardTabs';
import HeaderComponent from '../../components/elements/header/HeaderComponent';
import EventDachboardTopComponent from '../../components/screens/eventDashboard/eventDachboardTop';

const EventDashboardScreen = ({}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const {eventName: eventName, niceStartDate:eventDetails} = useEvent();

  useStatusBarStyle('dark-content');
  const handlePress = () => {
    navigation.navigate('Events');
  };

  return (
      <View style={globalStyle.backgroundWhite}>
        <HeaderComponent handlePress={handlePress} title={eventDetails?.newEventName} color={undefined} backgroundColor={undefined} />
        <View style={styles.container}>
          <EventDachboardTopComponent eventName={eventName} eventDetails={eventDetails} />
        </View>
        <EventDashBoardTabsNavigator searchQuery={searchQuery} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default EventDashboardScreen;
