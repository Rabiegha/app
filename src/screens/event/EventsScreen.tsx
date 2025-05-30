import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Animated, StatusBar, Platform, Alert} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import Search from '../../components/elements/Search';
import {useNavigation} from '@react-navigation/native';
import HeaderEvent from '../../components/elements/header/HeaderEvent';
import globalStyle from '../../assets/styles/globalStyle';
import {useEvent} from '../../context/EventContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../redux/store';
import {selectCurrentUserId, selectIsLoading} from '../../redux/selectors/auth/authSelectors';
import {logoutThunk} from '../../redux/thunks/auth/logoutThunk';
import TabsNavigator from '../../navigation/EventsNavigator';
import { useEventSelector } from '../../utils/event/selectEvent';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation types
type RootStackParamList = {
  Tabs: { screen: string };
  Connexion: undefined;
  Events: undefined;
  // Add other screens as needed
};

type EventsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Composant principal EventsScreen
const EventsScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => {
        StatusBar.setBarStyle('dark-content');
      };
    }, []),
  );


  const userId = useSelector(selectCurrentUserId);


  const {clearSessionDetails} = useEvent();
  const isLoading = useSelector(selectIsLoading);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const selectEvent = useEventSelector();

  const handleEventSelect = (event) => {
    selectEvent(event);
    clearSessionDetails();
    navigation.navigate('Tabs', {screen: 'EventDashboard'});
  };

  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
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
                console.log('userId', userId);
                // Use unwrap to properly handle async/await with createAsyncThunk
                await dispatch(logoutThunk()).unwrap();
                // Only navigate after successful logout
                navigation.reset({ index: 0, routes: [{ name: 'Connexion' }] });
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

  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(searchQuery ? 1 : 0);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <NavigationContainer independent={true}>
      <Spinner visible={isLoading} />
      <View style={globalStyle.backgroundWhite}>
        <HeaderEvent
          onLeftPress={clearSearch}
          onRightPress={handleLogOut}
          opacity={opacity}
        />
        <View style={styles.container}>
          <Search onChange={text => setSearchQuery(text)} value={searchQuery} />
        </View>
        {/* Utilisation du composant séparé pour le navigateur */}
        <TabsNavigator searchQuery={searchQuery} onEventSelect={handleEventSelect} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
});

export default EventsScreen;
