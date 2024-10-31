import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import colors from '../../colors/colors.ts';
import EventDetailsPerTypeComponent from '../components/screens/EventDetailsPerTypeComponent.tsx';
import useDetailsPerType from '../hooks/useDetailsPerType.tsx';

const EventDetailsPerTypeScreen = ({route}) => {
  const navigation = useNavigation();
  const {details, loading, error} = useDetailsPerType();

  const goBack = () => {
    navigation.goBack();
  };

  const {state} = route.params;

  useEffect(() => {
    console.log('detail per type', details);
    console.log('state', state);
  }, [details, state]);
  let data;
  switch (state) {
    case 'registered':
      data = details.totalRegisteredArr;
      break;
    case 'attended':
      data = details.totalAttendedArr;
      break;
    case 'not_attended':
      data = details.totalNotAttendedArr;
      break;
    default:
      data = [];
  }

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Details"
        color={colors.darkGrey}
        handlePress={goBack}
        backgroundColor={'white'}
      />
      {/*       <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.45}
        coverFill={'#FFF'}
      /> */}
      <View style={globalStyle.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          <EventDetailsPerTypeComponent data={data} />
        )}
      </View>
    </View>
  );
};

export default EventDetailsPerTypeScreen;
