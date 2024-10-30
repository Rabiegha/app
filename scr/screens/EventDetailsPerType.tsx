import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import colors from '../../colors/colors.ts';
import EventDetailsPerTypeComponent from '../components/screens/EventDetailsPerTypeComponent.tsx';
import useDetailsPerType from '../hooks/useDetailsPerType.tsx';
import PieChart from 'react-native-pie-chart';

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

  const widthAndHeight = 250;
  const series = [123, 321, 123, 789, 537];
  const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00'];

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Details"
        color={colors.darkGrey}
        handlePress={goBack}
        backgroundColor={'white'}
      />
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.45}
        coverFill={'#FFF'}
      />
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
