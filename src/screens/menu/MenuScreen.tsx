// MenuScreen.tsx
import React from 'react';
import {View, StyleSheet, StatusBar, ScrollView, Alert} from 'react-native';
import colors from '../../assets/colors/colors';
import LogOutButton from '../../components/elements/buttons/LogOutButton';
import {CommonActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import MenuListComponent from '../../components/screens/MenuListComponent';
import Spinner from 'react-native-loading-spinner-overlay';
import { logoutThunk } from '../../redux/thunks/auth/logoutThunk';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import MainHeader from '../../components/elements/header/MainHeader';
import { selectIsLoading, selectError } from '../../redux/selectors/auth/authSelectors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation types
export type RootStackParamList = {
  Tabs: { screen: string };
  Connexion: undefined;
  Menu: { screen: string };
  Profil: undefined;
  Events: undefined;
  SessionAttendeesList: undefined;
  More: undefined;
  Badge: undefined;
  ScanScreen: undefined;
  Printers: undefined;
  PaperFormat: undefined;
  WebView: undefined;
  Avenir: undefined;
  Passees: undefined;
};

type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MenuScreen = () => {
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const navigation = useNavigation<MenuScreenNavigationProp>();

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
        {title: 'Profil', action: () => navigation.navigate('Profil')},
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

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      // Show a confirmation dialog
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              try {
                // Use unwrap to properly handle async/await with createAsyncThunk
                await dispatch(logoutThunk()).unwrap();
                // Only navigate after successful logout
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Connexion'}],
                  }),
                );
              } catch (err) {
                // Handle logout error
                const errorMessage = err instanceof Error ? err.message : 'There was a problem logging out';
                Alert.alert('Logout Failed', errorMessage);
              }
            },
          },
        ],
        {cancelable: true},
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Logout error:', errorMessage);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={globalStyle.backgroundBlack}>
      <Spinner visible={isLoading} />
      <MainHeader
        title={'Outils'}
        onLeftPress={goBack}
        backgroundColor={colors.darkGrey}
        color={colors.greyCream}
      />
      {/* Wrap the content in a ScrollView */}
      <ScrollView style={globalStyle.container}>
        <View style={styles.container}>
          <MenuListComponent sections={sections} />
          <LogOutButton 
            onPress={handleLogout} 
            disabled={isLoading} 
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    // Use flex instead of fixed height for better responsiveness
    flex: 1,
    minHeight: 1000,
  },
});