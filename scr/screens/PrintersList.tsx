import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import {useEvent} from '../context/EventContext';
import colors from '../assets/colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import PrintersList from '../components/screens/print/PrintersListComponent';

const PrintersListScreen = ({route, navigation}) => {
  const handleGoBack = () => {
    navigation.navigate('Print');
  };
  const {triggerListRefresh} = useEvent();
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={'Imprimantes'}
        handlePress={handleGoBack}
        color={colors.darkGrey}
      />
      <View style={globalStyle.container}>
        <PrintersList
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
    color: colors.darkGrey,
  },
  itemName: {
    fontSize: 18,
    top: 50,
  },
});

export default PrintersListScreen;
