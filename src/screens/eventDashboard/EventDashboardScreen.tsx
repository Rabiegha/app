import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import globalStyle from '../../assets/styles/globalStyle';
import {useEvent} from '../../context/EventContext';
import useStatusBarStyle from '../../hooks/useStatusBarStyle';
import EventDashBoardTabsNavigator from '../../navigation/eventDashBoard/EventDashboardTabs';
import EventDachboardTopComponent from '../../components/screens/eventDashboard/eventDachboardTop';
import MainHeader from '../../components/elements/header/MainHeader';

const EventDashboardScreen = () => {
  const navigation = useNavigation();
  const [searchQuery] = useState('');

  const {eventName: eventName, niceStartDate:eventDetails, eventLogo: eventImage } = useEvent();


  useStatusBarStyle('dark-content');
  const handlePress = () => {
    navigation.goBack();
  };

  return (
      <View style={globalStyle.backgroundWhite}>
        <MainHeader
        onLeftPress={handlePress}
        />
        <View style={styles.container}>
          <EventDachboardTopComponent eventName={eventName} eventDetails={eventDetails} eventImage={eventImage} />
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
