import React, {
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import ListItem from './ListItem';
import axios from 'axios';
import {useEvent} from '../../../context/EventContext';
import colors from '../../../assets/colors/colors';
import {BASE_URL} from '../../../config/config';

import {Attendee} from '../../../interfaces/interfaces.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {demoEvents} from '../../../demo/demoEvents';
import {AuthContext} from '../../../context/AuthContext.tsx';
import emptyIcon from '../../../assets/images/empty.gif';
import {registrationSummaryDetails} from '../../../services/registrationSummaryDetailsService';
import useRegistrationSummary from '../../../hooks/registration/useRegistrationSummary.tsx';
import {fetchEventAttendeeList} from '../../../services/getAttendeesList';

import {useFocusEffect} from '@react-navigation/native';
/* import FastImage from 'react-native-fast-image'; */
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../../redux/selectors/auth/authSelectors.tsx';

const List = ({searchQuery, onUpdateProgress, filterCriteria}) => {
  const [openSwipeable, setOpenSwipeable] = useState(null);

  const handleSwipeableOpen = swipeable => {
    if (openSwipeable && openSwipeable.current && openSwipeable !== swipeable) {
      openSwipeable.current.close();
    }
    setOpenSwipeable(swipeable);
  };

  const [filteredData, setFilteredData] = useState([]);
  const [allAttendees, setAllAttendees] = useState([]);
  const flatListRef = useRef(null);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [totalCheckedAttendees, setTotalCheckedAttendees] = useState(0);
  const {refreshList, triggerListRefresh, updateAttendee, attendeesRefreshKey} =
    useEvent();
  const {eventId} = useEvent();
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {isDemoMode} = useContext(AuthContext);
  const userId = useSelector(selectCurrentUserId);

  const expirationTimeInMillis = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

  const storeData = async (key, value) => {
    try {
      const timestampedData = {
        data: value,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(timestampedData));
      console.log(`Stored data for key: ${key}`);
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
          console.log(`Data for key: ${key} is up-to-date`);
          return parsedData.data;
        } else {
          await AsyncStorage.removeItem(key);
          console.log(`Data for key: ${key} expired and removed`);
        }
      }
    } catch (e) {
      console.error('Error retrieving data', e);
    }
    return null;
  };

  const clearLocalData = async () => {
    try {
      await AsyncStorage.removeItem(`attendees_${eventId}`);
      setFilteredData([]);
      setAllAttendees([]);
      setTotalAttendees(0);
      setTotalCheckedAttendees(0);
      setHasData(false);
      triggerListRefresh();
    } catch (e) {
      console.error('Error clearing local data', e);
    }
  };

  const fetchAllEventAttendeeDetails = async () => {
    setIsLoading(true);
    try {
      let attendees = await getData(
        `attendees_${eventId}`,
        expirationTimeInMillis,
      );
      if (!attendees) {
        if (isDemoMode) {
          const selectedEvent = demoEvents.find(
            event => event.event_id == eventId,
          );
          if (selectedEvent) {
            attendees = selectedEvent.participants;
            await storeData(`attendees_${eventId}`, attendees);
          }
        } else {
          try {
            attendees = await fetchEventAttendeeList(userId, eventId);

            if (attendees) {
              await storeData(`attendees_${eventId}`, attendees);
            } else {
              attendees = [];
            }
          } catch (error) {
            console.error(
              'Error fetching data from server, using local data:',
              error,
            );
            attendees = [];
          }
        }
      }

      setAllAttendees(attendees || []);

      //Filter

      let filteredAttendees = attendees || [];
      if (filterCriteria.status == 'checked-in') {
        filteredAttendees = filteredAttendees.filter(
          attendee => attendee.attendee_status == 1,
        );
      } else if (filterCriteria.status == 'not-checked-in') {
        filteredAttendees = filteredAttendees.filter(
          attendee => attendee.attendee_status == 0,
        );
      }

      filteredAttendees.sort((a, b) => a.attendee_status - b.attendee_status);

      filteredAttendees = filteredAttendees.filter(attendee =>
        `${attendee.first_name} ${attendee.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );

      setFilteredData(filteredAttendees);
      setHasData(filteredAttendees.length > 0);
    } catch (error) {
      console.error('Error fetching attendee details:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  //Registration summary

  const {summary, loading, error} = useRegistrationSummary(userId, eventId);

  useEffect(() => {
    setTotalAttendees(summary.totalAttendees);
    setTotalCheckedAttendees(summary.totalCheckedIn);
  }, [summary]);

  useFocusEffect(
    useCallback(() => {
      clearLocalData();

      return () => {};
    }, [eventId]),
  );

  useEffect(() => {
    fetchAllEventAttendeeDetails();
  }, [
    eventId,
    searchQuery,
    refreshList,
    filterCriteria,
    isDemoMode,
    attendeesRefreshKey,
  ]);

  useEffect(() => {
    const ratio =
      totalAttendees > 0 ? (totalCheckedAttendees / totalAttendees) * 100 : 0;
    onUpdateProgress(totalAttendees, totalCheckedAttendees, ratio);
  }, [totalAttendees, totalCheckedAttendees, onUpdateProgress]);

  const handleUpdateAttendee = async updatedAttendee => {
    try {
      const updatedAttendees = allAttendees.map(attendee =>
        attendee.id == updatedAttendee.id ? updatedAttendee : attendee,
      );
      setAllAttendees(updatedAttendees);
      await storeData(`attendees_${eventId}`, updatedAttendees);

      const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${updatedAttendee.event_id}&attendee_id=${updatedAttendee.id}&attendee_status=${updatedAttendee.attendee_status}`;
      await axios.post(url);

      triggerListRefresh();
    } catch (error) {
      console.error('Error updating attendee', error);
    }
  };

  return (
    <View style={styles.list}>
      {isLoading ? (
        <ActivityIndicator color={colors.green} size="large" />
      ) : hasData ? (
        <FlatList
          ref={flatListRef}
          contentContainerStyle={styles.contentContainer}
          data={filteredData}
          keyExtractor={item => `${item.id}_${item.attendee_status}`}
          renderItem={({item}) => (
            <ListItem
              item={item}
              searchQuery={searchQuery}
              onUpdateAttendee={handleUpdateAttendee}
              onSwipeableOpen={handleSwipeableOpen}
            />
          )}
        />
      ) : (
        <View style={styles.noDataView}>
{/*           <FastImage source={emptyIcon} style={styles.gifStyle} /> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 120,
  },
  contentContainer: {
    paddingBottom: 300,
  },
  gifStyle: {
    height: 300,
    width: 300,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default List;
