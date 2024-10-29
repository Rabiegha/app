import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import useUserId from '../hooks/useUserId.js';
import colors from '../../colors/colors.ts';
import EventDetailsComponent from '../components/screens/EventDetailsComponent.tsx';
import useRegistrationData from '../hooks/useRegistrationData.tsx';

const EventDetailsScreen = ({}) => {
  const {summary, loading, error} = useRegistrationData();

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Details"
        color={colors.darkGrey}
        handlePress={undefined}
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
          />
        )}
      </View>
    </View>
  );
};

export default EventDetailsScreen;
