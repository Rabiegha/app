import React, {
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {useEvent} from '../../../context/EventContext';
import colors from '../../../assets/colors/colors';
import {BASE_URL} from '../../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {demoEvents} from '../../../demo/demoEvents';
import {AuthContext} from '../../../context/AuthContext.tsx';
import {fetchEventAttendeeList} from '../../../services/getAttendeesList';
import {useFocusEffect} from '@react-navigation/native';
import ListItem from './ListItem';

// Redux
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../../redux/selectors/auth/authSelectors';
/** NEW: If your store is set up so that “search” slice has isSearchByCompanyMode,
    import from whichever slice you have:
**/
import { selectIsSearchByCompanyMode } from '../../../redux/selectors/search/searchSelectors';
// or if you’re directly accessing state.search.isSearchByCompanyMode, see code below

const List = ({searchQuery, onTriggerRefresh, filterCriteria}) => {
  const [openSwipeable, setOpenSwipeable] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [allAttendees, setAllAttendees] = useState([]);

  const flatListRef = useRef(null);
  const {refreshList, triggerListRefresh, updateAttendee, attendeesRefreshKey} = useEvent();
  const {eventId} = useEvent();
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {isDemoMode} = useContext(AuthContext);

  // Pull userId from Redux
  const userId = useSelector(selectCurrentUserId);
  // Pull “search by company” from Redux (adjust to match your actual slice)
  const isSearchByCompanyMode = useSelector(
    state => state.search.isSearchByCompanyMode
  );

  const expirationTimeInMillis = 24 * 60 * 60 * 1000; // 24 hours

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
      setHasData(false);
      triggerListRefresh();
    } catch (e) {
      console.error('Error clearing local data', e);
    }
  };

  /**
   * Main function to fetch the attendee list from local storage (if fresh),
   * or from the server if not in local storage or data is expired.
   */
  const fetchAllEventAttendeeDetails = async () => {
    setIsLoading(true);
    try {
      let attendees = await getData(`attendees_${eventId}`, expirationTimeInMillis);

      if (!attendees) {
        if (isDemoMode) {
          // Demo mode uses local “demoEvents”
          const selectedEvent = demoEvents.find(event => event.event_id == eventId);
          if (selectedEvent) {
            attendees = selectedEvent.participants;
            await storeData(`attendees_${eventId}`, attendees);
          } else {
            attendees = [];
          }
        } else {
          // Real mode fetch from server
          try {
            attendees = await fetchEventAttendeeList(userId, eventId);
            if (!attendees) attendees = [];
            await storeData(`attendees_${eventId}`, attendees);
          } catch (error) {
            console.error('Error fetching data from server:', error);
            attendees = [];
          }
        }
      }

      // Store the entire raw list so we can re-filter on the fly
      setAllAttendees(attendees || []);

      // Now apply filtering
      let filteredAttendees = attendees || [];

      // 1) Filter by status
      if (filterCriteria.status === 'checked-in') {
        filteredAttendees = filteredAttendees.filter(a => a.attendee_status == 1);
      } else if (filterCriteria.status === 'not-checked-in') {
        filteredAttendees = filteredAttendees.filter(a => a.attendee_status == 0);
      }

      // 2) Sort checked-in to bottom or top if you want
      filteredAttendees.sort((a, b) => a.attendee_status - b.attendee_status);

      // 3) If we have a search query, filter by name + possibly company
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        filteredAttendees = filteredAttendees.filter(attendee => {
          // Always include first+last name in the search text
          let combinedText = `${attendee.first_name} ${attendee.last_name}`.toLowerCase();

          // If “search by company” is on, also add the organization
          if (isSearchByCompanyMode && attendee.organization) {
            combinedText += ` ${attendee.organization.toLowerCase()}`;
          }

          // Return true if `combinedText` includes the query
          return combinedText.includes(query);
        });
      }

      // Done
      setFilteredData(filteredAttendees);
      setHasData(filteredAttendees.length > 0);
    } catch (error) {
      console.error('Error fetching attendee details:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

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
    isSearchByCompanyMode, // ADDED: re-fetch or re-filter if toggled
  ]);

  // This function is passed to ListItem for updating a single attendee’s status
  const handleUpdateAttendee = async updatedAttendee => {
    try {
      // Update local state
      const updatedAttendees = allAttendees.map(attendee =>
        attendee.id === updatedAttendee.id ? updatedAttendee : attendee
      );
      setAllAttendees(updatedAttendees);
      await storeData(`attendees_${eventId}`, updatedAttendees);

      // Make server call
      const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${updatedAttendee.event_id}&attendee_id=${updatedAttendee.id}&attendee_status=${updatedAttendee.attendee_status}`;
      await axios.post(url);

      triggerListRefresh();
      onTriggerRefresh();
    } catch (error) {
      console.error('Error updating attendee', error);
    }
  };

  const handleSwipeableOpen = swipeable => {
    if (openSwipeable && openSwipeable.current && openSwipeable !== swipeable) {
      openSwipeable.current.close();
    }
    setOpenSwipeable(swipeable);
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
          {/* Insert your empty state UI */}
        </View>
      )}
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 120,
  },
  contentContainer: {
    paddingBottom: 300,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
