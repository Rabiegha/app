import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform, StatusBar} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import HeaderEvent from '../../components/elements/header/HeaderEvent';
import Search from '../../components/elements/Search';

import globalStyle from '../../assets/styles/globalStyle';
import {useEvent} from '../../context/EventContext';
import useStatusBarStyle from '../../hooks/useStatusBarStyle';
import EventDashBoardTabsNavigator from '../../navigation/eventDashBoard/EventDashBoardTabsNavigator';

const EventDashboardScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {eventDetails} = useEvent();

  useStatusBarStyle('dark-content');

  return (
    <NavigationContainer independent={true}>
      <View style={globalStyle.backgroundWhite}>
        <HeaderEvent title={eventDetails?.newEventName} />
        <View style={styles.container}>
          <Search value={searchQuery} onChange={setSearchQuery} />
        </View>
        <EventDashBoardTabsNavigator searchQuery={searchQuery} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default EventDashboardScreen;
