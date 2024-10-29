import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import useUserId from '../hooks/useUserId.js';
import colors from '../../colors/colors.ts';
const EventDetailsScreen = ({}) => {
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Details"
        color={colors.darkGrey}
        handlePress={undefined}
        backgroundColor={'white'}
      />
    </View>
  );
};

export default EventDetailsScreen;
