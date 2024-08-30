// MenuScreen.js
import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import colors from '../../colors/colors';
import LogOutButton from '../components/elements/buttons/LogOutButton';
import {logoutUser} from '../services/Api/Login-out';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import globalStyle from '../assets/styles/globalStyle';
import MenuListComponent from '../components/screens/MenuListComponent';
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

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
        {
          title: 'Liste des événements',
          action: () => navigation.navigate('Events'),
        },
        {
          title: 'Liste des participants',
          action: () => navigation.navigate('Attendees'),
        },
        {
          title: 'Ajouter un participant',
          action: () => navigation.navigate('Add'),
        },
        {title: 'Scan', action: () => navigation.navigate('Scann')},
        {
          title: 'Profile',
          action: () => navigation.navigate('Profil'),
        },
      ],
    },
    {
      title: 'Aide & Support',
      buttons: [
        {title: 'À propos', action: () => navigation.navigate('About')},
        {title: 'Centre d’aide', action: () => navigation.navigate('Help')},
      ],
    },
    // Add more sections as needed
  ];
  const handleLogout = async () => {
    await logout();
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
      <View style={globalStyle.container}>
        <View style={{top: 60}}>
          <MenuListComponent sections={sections} />
          <LogOutButton onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default MenuScreen;
