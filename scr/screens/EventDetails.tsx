import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import useUserId from '../hooks/useUserId.js';
import colors from '../../colors/colors.ts';
import EventDetailsComponent from '../components/screens/EventDetailsComponent.tsx';
import useRegistrationData from '../hooks/useRegistrationData.tsx';
import useDetailsPerType from '../hooks/useDetailsPerType.tsx';

const EventDetailsScreen = () => {
  const navigation = useNavigation();
  const {summary, loading, error} = useRegistrationData();
  const {details, loading1, error1} = useDetailsPerType();
  const goBack = () => {
    navigation.goBack();
  };

  const handlePress = dataType => {
    let state;
    switch (dataType) {
      case 'registered':
        state = 'registered';
        break;
      case 'attended':
        state = 'attended';
        break;
      case 'not_attended':
        state = 'attended';
        break;
      default:
        state = null;
    }
    navigation.navigate('EventDetailsPerType', {state});
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
            totalAttendees={summary.totalAttendees}
            totalCheckedIn={summary.totalCheckedIn}
            totalNotCheckedIn={summary.totalNotCheckedIn}
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
