import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Animated, StatusBar, Platform} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import Search from '../../components/elements/Search';
import {useNavigation} from '@react-navigation/native';
import HeaderEvent from '../../components/elements/header/HeaderEvent';
import globalStyle from '../../assets/styles/globalStyle';
import {useEvent} from '../../context/EventContext';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsLoading} from '../../redux/selectors/auth/authSelectors';
import {logoutThunk} from '../../redux/thunks/auth/logoutThunk';
import TabsNavigator from '../../navigation/EventsNavigator';
import { useEventSelector } from '../../utils/event/selectEvent';

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


  const isLoading = useSelector(selectIsLoading);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const selectEvent = useEventSelector();

  const handleEventSelect = (event) => {
    selectEvent(event);
    navigation.navigate('Tabs', {screen: 'Attendees'});
  };

  const dispatch = useDispatch();

  const handleGoBack = () => {
    dispatch(logoutThunk());
    navigation.navigate('Connexion');
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
          onRightPress={handleGoBack}
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
