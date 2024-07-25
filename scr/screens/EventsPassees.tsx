import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
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

const EventPasseesScreen = ({searchQuery, onEventSelect}) => {
  const [userId, setUserId] = useUserId();
  const [eventDetails, setEventDetails] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {updateStatsPassees} = useEvent();
  const {isDemoMode} = useContext(AuthContext);

  const expirationTimeInMillis = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

  const storeData = async (key, value) => {
    try {
      const timestampedData = {
        data: value,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(timestampedData));
    } catch (e) {
      console.error('Error saving data', e);
    }
  };

  const getData = async (key, expirationTimeInMillis) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const parsedData = JSON.parse(value);
        const currentTime = Date.now();
        if (currentTime - parsedData.timestamp < expirationTimeInMillis) {
          return parsedData.data;
        } else {
          // Supprimer les données si elles sont obsolètes
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.error('Error retrieving data', e);
    }
    return null;
  };

  // Clear local data

  const clearLocalData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Local data cleared');
    } catch (e) {
      console.error('Error clearing local data', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      clearLocalData();

      return () => {
        // Any cleanup can be done here
      };
    }, []),
  );
  // Clear local data

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => {
        StatusBar.setBarStyle('dark-content'); // Reset status bar style when screen loses focus
      };
    }, []),
  );

  useEffect(() => {
    const getEventDetails = async () => {
      let events = await getData('events_passes', expirationTimeInMillis);
      if (!events) {
        if (isDemoMode) {
          // Si le mode démo est activé, utiliser les données factices
          events = demoEvents;
          await storeData('events_passes', events);
          setEventDetails(events);
          setHasData(events.length > 0);
          setIsLoading(false);
          updateStatsPassees({
            newTotalePassees: demoEvents.length,
          });
          return;
        } else {
          try {
            // URL de l'API pour afficher les événements passés
            const url = `${BASE_URL}/ajax_get_event_details/?current_user_login_details_id=${userId}&is_event_from=0`;
            const response = await axios.get(url);
            if (
              response.data.status &&
              response.data.event_details &&
              response.data.event_details.length > 0
            ) {
              const eventDetailsData = response.data.event_details;
              await storeData('events_passes', eventDetailsData);
              setEventDetails(eventDetailsData);
              setHasData(true);
              const eventDataLength = eventDetailsData.length;
              // Mettez à jour la valeur dans le contexte ou où vous en avez besoin
              updateStatsPassees({
                newTotalePassees: eventDataLength,
              });
            } else {
              console.error(
                'Failed to fetch event details or no events available',
              );
              setEventDetails([]);
              setHasData(false);
            }
          } catch (error) {
            console.error('Error fetching event details:', error);
            setEventDetails([]);
            setHasData(false);
          } finally {
            setIsLoading(false); // Arrêter le chargement quelle que soit l'issue
          }
        }
      } else {
        setEventDetails(events);
        setHasData(events.length > 0);
        setIsLoading(false);
      }
    };

    getEventDetails();
  }, [isDemoMode]); // Recharger les données si le mode démo change

  const filteredEvents = eventDetails.filter(event =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectEvent = event => {
    onEventSelect(event); // Utilisez le callback pour passer les données de l'événement
  };

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.green}
          style={styles.loadingIndicator}
        />
      ) : hasData ? (
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
              onPress={handleSelectEvent}
              eventDate={item.nice_start_datetime}
              eventType={item.event_type_name}
            />
          )}
        />
      ) : (
        <View style={styles.noDataView}>
          <FastImage source={empty} style={styles.gifStyle} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
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
  // Autres styles si nécessaire
});

export default EventPasseesScreen;
