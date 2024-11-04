import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import colors from '../../colors/colors.ts';
import EventDetailsPerTypeComponent from '../components/screens/EventDetailsPerTypeComponent.tsx';
import useDetailsPerType from '../hooks/useDetailsPerType.tsx';
/* import { PieChart } from 'react-native-chart-kit'; */

const screenWidth = Dimensions.get('window').width;


const EventDetailsPerTypeScreen = ({route}) => {
  const navigation = useNavigation();
  const {details, loading, error} = useDetailsPerType();


  const goBack = () => {
    navigation.goBack();
  };

  const {state, total} = route.params;

  useEffect(() => {
    console.log('total', total);
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

  const data1 = [
    { name: 'A', population: 40, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'B', population: 60, color: 'blue', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Details"
        color={colors.darkGrey}
        handlePress={goBack}
        backgroundColor={'white'}
      />
      {/* <PieChart
        data={data1}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
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
