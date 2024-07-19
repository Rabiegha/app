import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios'; // Assurez-vous d'importer axios
import ListEvents from '../components/screens/events/ListEvents';
import {useEvent} from '../context/EventContext';
import {useFocusEffect} from '@react-navigation/native';
import colors from '../../colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import {BASE_URL} from '../config/config';
import useUserId from '../hooks/useUserId';
import empty from '../assets/images/empty.gif';

const EventPasseesScreen = ({searchQuery, onEventSelect}) => {
  const [userId, setUserId] = useUserId();
  const [eventDetails, setEventDetails] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {updateStatsPassees} = useEvent();
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content'); // Set status bar style to light-content
      return () => {
        StatusBar.setBarStyle('dark-content'); // Reset status bar style when screen loses focus
      };
    }, []),
  );

  useEffect(() => {
    const getEventDetails = async () => {
      setIsLoading(true); // Commencer le chargement
      try {
        // URL de l'API pour afficher les evenement passés
        const url = `${BASE_URL}/ajax_get_event_details/?current_user_login_details_id=${userId}&is_event_from=0`;
        const response = await axios.get(url);
        if (
          response.data.status &&
          response.data.event_details &&
          response.data.event_details.length > 0
        ) {
          const eventDetailsData = response.data.event_details;
          setEventDetails(response.data.event_details);
          setHasData(true);
          const eventDataLength = eventDetailsData.length;
          // Mettez à jour la valeur dans le contexte ou où vous en avez besoin
          updateStatsPassees({
            newTotalePassees: eventDataLength,
          });
        } else {
          console.error('Failed to fetch event details or no events available');
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
    };

    getEventDetails();
  }, []);

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
  // Autres styles si nécessaire
});

export default EventPasseesScreen;
