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
  SectionList,
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
} from '../redux/selectors/eventSelectors';
import {clearEvents, fetchEvents} from '../redux/slices/eventSlice';
import {parse} from 'date-fns';

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
  const isEventFromList = [1, 2];
  const expirationTimeInMillis = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

  const {isDemoMode} = useContext(AuthContext);

  const currentTime = Date.now();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

    if (
      !events ||
      events.length === 0 ||
      currentTime - (timeStamp || 0) > expirationTimeInMillis
    ) {
      dispatch(fetchEvents({userId, isEventFromList, isDemoMode}));
    } else {
      /* console.error('event list not fetched'); */
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

  const parseDateString = dateString => {
    return parse(dateString, 'dd/MM/yyyy hh:mm a', new Date());
  };

  const test = [
    {
      description: '',
      ems_secret_code: 'sw3gsi1s12pghkirllqexsgfo2vkia',
      event_id: 406,
      event_name: '1',
      event_team_members:
        'Cem Koseoglu, Francoise Faure, Jean-Francois LeNilias',
      event_type_name: 'Webinar',
      nice_end_datetime: '14/11/2024 11:59 PM',
      nice_start_datetime: '14/11/2024 09:15 AM',
    },
    {
      description: '',
      ems_secret_code: 'ywrxt4xmfg5u26di6n1u69vsy5i7p9',
      event_id: 416,
      event_name: '1',
      event_team_members: 'Ben Rais, Cem Koseoglu, Corentin Kistler',
      event_type_name: 'Diner',
      nice_end_datetime: '14/11/2024 11:59 PM',
      nice_start_datetime: '14/11/2024 06:30 PM',
    },
    {
      description: '',
      ems_secret_code: '0p23s7gxkk08bqvm87y1g3o767hn04',
      event_id: 367,
      event_name: '1',
      event_team_members: 'Ben Rais, Corentin Kistler',
      event_type_name: 'Other',
      nice_end_datetime: '20/11/2024 11:59 PM',
      nice_start_datetime: '20/11/2024 09:30 AM',
    },
    {
      description: '',
      ems_secret_code: 'jr0pc8c2l3vv3m1cox3c6zpc7rxezn',
      event_id: 400,
      event_name: '1',
      event_team_members: 'Ben Rais, Corentin Kistler',
      event_type_name: 'Other',
      nice_end_datetime: '05/12/2024 11:59 PM',
      nice_start_datetime: '03/12/2024 08:00 AM',
    },
  ];

  const eventsToday = events.filter(event => {
    const eventDateStr = event.nice_start_datetime;
    const eventDate = parseDateString(eventDateStr);

    if (isNaN(eventDate)) {
      console.warn('Invalid event date:', eventDateStr);
      return false;
    }

    return eventDate.toDateString() === today.toDateString();
  });

  const futureEvents = events.filter(event => {
    const eventDateStr = event.nice_start_datetime;
    const eventDate = parseDateString(eventDateStr);

    if (isNaN(eventDate)) {
      console.warn('Invalid event date:', eventDateStr);
      return false;
    }

    return eventDate > today;
  });

  const filteredEvents = events
    ? events.filter(event =>
        event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const sections = [];

  if (eventsToday.length > 0) {
    sections.push({
      title: "Aujourd'hui",
      data: eventsToday,
      isFutureSection: false,
    });
  }

  if (futureEvents.length > 0) {
    sections.push({
      title: '',
      data: futureEvents,
      isFutureSection: true,
    });
  }

  useEffect(() => {
    console.log('sections', sections);
  }, [sections]);

  const handleClearData = () => {
    dispatch(clearEvents());
  };

  useFocusEffect(
    useCallback(() => {
      handleClearData();
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
        style={[styles.activityIndicator, globalStyle.backgroundWhite]}
      />
    );
  }

  if (!events || events.length === 0) {
    return (
      <View style={[styles.noDataView, globalStyle.backgroundWhite]}>
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

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <SectionList
        sections={sections}
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
        renderSectionHeader={({section}) => {
          const {title, isFutureSection} = section;
          const shouldApplyMargin = isFutureSection && eventsToday.length > 0;

          return (
            <View
              style={[
                styles.sectionHeader,
                shouldApplyMargin && styles.futureSectionHeader,
              ]}>
              {title ? (
                <Text style={styles.sectionHeaderText}>{title}</Text>
              ) : null}
            </View>
          );
        }}
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
    color: colors.green,
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
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.darkGrey,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  futureSectionHeader: {
    marginTop: 20, // Adjust this value to control the space between sections
  },
});

export default EventAvenirScreen;
