// MenuScreen.js
import React, {useContext} from 'react';
import {View, StyleSheet, StatusBar, ScrollView} from 'react-native';
import colors from '../../assets/colors/colors';
import LogOutButton from '../../components/elements/buttons/LogOutButton';
import {CommonActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import HeaderComponent from '../../components/elements/header/HeaderComponent';
import globalStyle from '../../assets/styles/globalStyle';
import MenuListComponent from '../../components/screens/MenuListComponent';
import {AuthContext} from '../../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { logoutThunk } from '../../redux/thunks/auth/logoutThunk';
import { useDispatch } from 'react-redux';

const MenuScreen = ({}) => {
  const {isLoading, logout} = useContext(AuthContext);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => {
        StatusBar.setBarStyle('default');
      };
    }, []),
  );

  const sections = [
    {
      title: 'Menu',
      buttons: [
        {title: 'Event details', action: () => navigation.navigate('Menu', { screen: 'EventDetails' })},
      ],
    },
    {
      title: 'Paramètres',
      buttons: [
        {title: 'Scanner Settings', action: () => navigation.navigate('Menu', { screen: 'ScanSettings' })},
        {title: 'Search Settings', action: () => navigation.navigate('Menu', { screen : 'SearchSettings'})},
        {title: 'Guest List Settings', action: () => navigation.navigate('Menu', {screen :'SearchSettings'})},
      ],
    },
    {
      title: 'Aide & Support',
      buttons: [
        {title: 'À propos', action: () => navigation.navigate('Menu', { screen: 'About' })},
        {title: 'Centre d’aide', action: () => navigation.navigate('Menu', { screen: 'Help' })},
      ],
    },
  ];

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Connexion'}],
      }),
    );
  };

  return (
    <View style={globalStyle.backgroundBlack}>
      <Spinner visible={isLoading} />
      <HeaderComponent
        title={'Outils'}
        color={colors.greyCream}
        handlePress={() => navigation.navigate('Attendees')}
      />
      {/* Wrap the content in a ScrollView */}
      <ScrollView style={globalStyle.container}>
        <View style={styles.container}>
          <MenuListComponent sections={sections} />
          <LogOutButton onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    // Remove the fixed height
  height: 1000,
  },
});