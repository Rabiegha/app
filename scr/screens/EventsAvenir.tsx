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

const EventListScreen = ({searchQuery, onEventSelect}) => {
  const [userId, setUserId] = useUserId();
  const [hasData, setHasData] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {updateStatsAvenir} = useEvent();
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
      console.log('user id', userId);

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
      let events = await getData('events', expirationTimeInMillis);
      if (!events) {
        if (isDemoMode) {
          await AsyncStorage.clear();
          // Si le mode démo est activé, utiliser les données factices
          await storeData('events', events);
          events = demoEvents;
          setEventDetails(events);
          setHasData(events.length > 0);
          setIsLoading(false);
          updateStatsAvenir({
            newTotaleAvenir: demoEvents.length,
          });
          return;
        } else {
          try {
            // URL de l'API pour afficher les événements
            const url = `${BASE_URL}/ajax_get_event_details/?current_user_login_details_id=${userId}&is_event_from=2`;
            const url1 = `${BASE_URL}/ajax_get_event_details/?current_user_login_details_id=${userId}&is_event_from=1`;

            // Initialisez un tableau pour stocker les résultats combinés
            let combinedEventDetails = [];

            // Créez une fonction pour traiter chaque requête individuellement
            const fetchEvents = async url => {
              try {
                const response = await axios.get(url);
                if (response.data.status) {
                  return response.data.event_details;
                } else {
                  console.error('Failed to fetch event details from', url);
                  return [];
                }
              } catch (error) {
                console.error('Error fetching event details from', url, error);
                return []; // En cas d'erreur, retournez un tableau vide pour éviter de briser la combinaison
              }
            };

            // Exécutez les requêtes simultanément et stockez les résultats
            const results = await Promise.all([
              fetchEvents(url1),
              fetchEvents(url),
            ]);

            // Combine les résultats des deux requêtes
            combinedEventDetails = [...results[0], ...results[1]];

            // Stockez les événements localement
            await storeData('events', combinedEventDetails);

            // Mettez à jour l'état avec les détails des événements combinés
            setEventDetails(combinedEventDetails);

            // Mettez à jour hasData pour refléter si des données ont été reçues
            setHasData(combinedEventDetails.length > 0);

            // Calculer la somme des longueurs des tableaux résultants
            const totalLength = results[0].length + results[1].length;
            // Utiliser cette valeur pour mettre à jour les statistiques
            updateStatsAvenir({
              newTotaleAvenir: totalLength,
            });
          } catch (generalError) {
            console.error('An unexpected error occurred:', generalError);
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
    setSelectedEvent(event); // Mettre à jour l'événement sélectionné
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
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.green}
          style={styles.loadingIndicator}
        />
      ) : hasData ? (
        //******************* */ A revoir **********************************
        false ? (
          <View style={styles.participantsContainer}>
            <TouchableOpacity onPress={() => setSelectedEvent(null)}>
              <Text style={styles.backButton}>Retour aux événements</Text>
            </TouchableOpacity>
            <Text style={styles.eventTitle}>{selectedEvent.event_name}</Text>
            <FlatList
              data={selectedEvent.participants}
              keyExtractor={item => item.participant_id.toString()}
              renderItem={renderParticipant}
            />
          </View>
        ) : (
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
        )
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
});

export default EventListScreen;
