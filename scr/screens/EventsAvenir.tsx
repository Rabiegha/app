import React, {useState, useEffect} from 'react';
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import colors from '../../colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import {BASE_URL} from '../config/config';
import useUserId from '../hooks/useUserId';
import empty from '../assets/images/empty.gif';

const EventAvenirScreen = ({searchQuery, onEventSelect}) => {
  const [userId, setUserId] = useUserId();
  const [hasData, setHasData] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {updateStatsAvenir} = useEvent();
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
      try {
        // URL de l'API pour afficher les evenemet a venir + aujourd'hui
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
    };

    getEventDetails();
  }, []);

  const filteredEvents = eventDetails.filter(event =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleSelectEvent = event => {
    onEventSelect(event); // Utiliser le callback pour passer les données de l'événement
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
          <Image source={empty} style={styles.gifStyle} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 2,
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
});

export default EventAvenirScreen;
