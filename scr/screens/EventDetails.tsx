import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import colors from '../assets/colors/colors';
import EventDetailsComponent from '../components/screens/EventDetailsComponent.tsx';
import useRegistrationData from '../hooks/registration/useRegistrationSummary.tsx';

const EventDetailsScreen = () => {
  const navigation = useNavigation();
  const {summary, loading, error} = useRegistrationData();
  const totalAttendees = summary.totalAttendees;
  const totalCheckedIn = summary.totalCheckedIn;
  const totalNotCheckedIn = summary.totalNotCheckedIn;
  const goBack = () => {
    navigation.goBack();
  };

  const handlePress = dataType => {
    let state;
    let total;
    switch (dataType) {
      case 'registered':
        state = 'registered';
        total = totalAttendees;
        break;
      case 'attended':
        state = 'attended';
        total = totalCheckedIn;
        break;
      case 'not_attended':
        state = 'not_attended';
        total = totalNotCheckedIn;
        break;
      default:
        state = null;
        total = null;
    }
    navigation.navigate('EventDetailsPerType', {state, total});
  };

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Details"
        color={colors.darkGrey}
        handlePress={goBack}
        backgroundColor={'white'}
      />
      <View style={globalStyle.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <EventDetailsComponent
            totalAttendees={totalAttendees}
            totalCheckedIn={totalCheckedIn}
            totalNotCheckedIn={totalNotCheckedIn}
            totalAttendeesAction={() => handlePress('registered')}
            checkedInAction={() => handlePress('attended')}
            notCheckedOInAction={() => handlePress('not_attended')}
          />
        )}
      </View>
    </View>
  );
};

export default EventDetailsScreen;
