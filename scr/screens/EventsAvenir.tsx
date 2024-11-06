import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import axios from 'axios';
import ListEvents from '../components/screens/events/ListEvents';
import {useEvent} from '../context/EventContext';
import {useFocusEffect} from '@react-navigation/native';
import colors from '../../colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import {BASE_URL} from '../config/config';
import useUserId from '../hooks/useUserId';
import empty from '../assets/images/empty.gif';
import {AuthContext} from '../context/AuthContext';
import {demoEvents} from '../demo/demoEvents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectEvents,
  selectLoading,
  selectError,
  selectTimeStamp,
} from '../redux/selectors/eventSelecots';
import {fetchEvents} from '../redux/slices/eventSlice';

const EventAvenirScreen = ({searchQuery, onEventSelect}) => {
  // Clear local data
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => {
        StatusBar.setBarStyle('dark-content'); // Reset status bar style when screen loses focus
      };
    }, []),
  );

  // Use selectors
  const events = useSelector(selectEvents);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const timeStamp = useSelector(selectTimeStamp);

  const [userId, setUserId] = useUserId();
  const dispatch = useDispatch();
  const isEventFromList = [2];
  const expirationTimeInMillis = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

  const {isDemoMode} = useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      // Do nothing while loading or if there's an error
      return;
    }

    if (error) {
      console.log('An error occurred:', error);
      // Optionally handle the error
      return;
    }

    const currentTime = Date.now();
    if (
      !events ||
      events.length === 0 ||
      currentTime - (timeStamp || 0) > expirationTimeInMillis
    ) {
      dispatch(fetchEvents({userId, isEventFromList, isDemoMode}));
    } else {
      console.error('event list not fetched');
    }
  }, [
    dispatch,
    userId,
    isEventFromList,
    events,
    isDemoMode,
    timeStamp,
    loading,
    error,
  ]);

  const filteredEvents = events
    ? events.filter(event =>
        event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  useFocusEffect(
    useCallback(() => {
      console.log('user id', userId);

      return () => {
        // Any cleanup can be done here
      };
    }, [userId]),
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.green}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      />
    );
  }

  if (!events || events.length === 0) {
    return (
      <View style={styles.noDataView}>
        <FastImage source={empty} style={styles.gifStyle} />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const handleSelectEvent = event => {
    onEventSelect(event); // Utiliser le callback pour passer les données de l'événement
  };

  const renderParticipant = ({item}) => (
    <View style={styles.participantItem}>
      <Text style={styles.participantName}>{item.name}</Text>
      <Text>{item.email}</Text>
    </View>
  );

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <View>
        <Text style={styles.title}>Aujourd'hui</Text>
        <FlatList
          data={filteredEvents}
          keyExtractor={item => item.event_id.toString()}
          renderItem={({item}) => (
            <ListEvents
              eventData={{
                event_name: item.event_name,
                ems_secret_code: item.ems_secret_code.toString(),
                event_id: item.event_id,
              }}
              searchQuery={searchQuery}
              onPress={() => handleSelectEvent(item)}
              eventDate={item.nice_start_datetime}
              eventType={item.event_type_name}
            />
          )}
        />
      </View>
      <Text style={styles.title}>Aujourd'hui</Text>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.event_id.toString()}
        renderItem={({item}) => (
          <ListEvents
            eventData={{
              event_name: item.event_name,
              ems_secret_code: item.ems_secret_code.toString(),
              event_id: item.event_id,
            }}
            searchQuery={searchQuery}
            onPress={() => handleSelectEvent(item)}
            eventDate={item.nice_start_datetime}
            eventType={item.event_type_name}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifStyle: {
    height: 300,
    width: 300,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantsContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    color: colors.blue,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  participantItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },
});

export default EventAvenirScreen;
