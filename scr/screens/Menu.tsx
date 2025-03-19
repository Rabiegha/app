// MenuScreen.js
import React, {useContext} from 'react';
import {View, StyleSheet, StatusBar, ScrollView} from 'react-native';
import colors from '../assets/colors/colors';
import LogOutButton from '../components/elements/buttons/LogOutButton';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import globalStyle from '../assets/styles/globalStyle';
import MenuListComponent from '../components/screens/MenuListComponent';
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { logoutThunk } from '../redux/thunks/auth/logoutThunk';
import { useDispatch } from 'react-redux';

const MenuScreen = ({navigation}) => {
  const {isLoading, logout} = useContext(AuthContext);

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
        {title: 'Liste des événements', action: () => navigation.navigate('Events')},
        {title: 'Liste des participants', action: () => navigation.navigate('Attendees')},
        {title: 'Ajouter un participant', action: () => navigation.navigate('Add')},
        {title: 'Scan', action: () => navigation.navigate('Scan')},
        {title: 'Print', action: () => navigation.navigate('Print')},
        {title: 'Event details', action: () => navigation.navigate('EventDetails')},
      ],
    },
    {
      title: 'Paramètres',
      buttons: [
        {title: 'Paramètres du scanner', action: () => navigation.navigate('ScanSettings')},
        {title: 'Paramètres de recherche', action: () => navigation.navigate('SearchSettings')},
      ],
    },
    {
      title: 'Aide & Support',
      buttons: [
        {title: 'À propos', action: () => navigation.navigate('About')},
        {title: 'Centre d’aide', action: () => navigation.navigate('Help')},
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