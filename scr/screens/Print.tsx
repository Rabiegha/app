import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import {useEvent} from '../context/EventContext';
import axios from 'axios';
import Share from 'react-native-share';
import ProfileComponent from '../components/screens/ProfileComponent';
import colors from '../../colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import PrintComponent from '../components/screens/print/PrintComponent';

const ProfilScreen = ({route, navigation}) => {
  const handleGoBack = () => {
    navigation.navigate('Attendees');
  };
  const {triggerListRefresh} = useEvent();
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={'Paramètres d’impression'}
        handlePress={handleGoBack}
        color={colors.darkGrey}
      />
      <View style={globalStyle.container}>
        <PrintComponent
          firstName={undefined}
          lastName={undefined}
          email={undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 30,
    marginRight: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemName: {
    fontSize: 18,
    top: 50,
  },
});

export default ProfilScreen;
