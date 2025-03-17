import React, {
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
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
import axios from 'axios';
import EmptyView from '../../elements/view/EmptyView.tsx';
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
  // If you have a “search by company” mode, wire it here; for now just “false”:
  const isSearchByCompanyMode = false;

  /**
   * 1) Debounce logic: track a “debouncedSearchQuery” that updates
   *    only after the user stops typing for 300ms.
   */
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Wait 300ms after the last keystroke

    return () => {
      clearTimeout(handler); // Clear on unmount or re-run
    };
  }, [searchQuery]);

  /**
   * Fetches and sets the raw attendee list (WITHOUT storing to AsyncStorage).
   */
  const fetchAllEventAttendeeDetails = async () => {
    setIsLoading(true);
    try {
      let attendees = [];

      if (isDemoMode) {
        // Demo mode uses local “demoEvents” data
        const selectedEvent = demoEvents.find(e => e.event_id == eventId);
        if (selectedEvent) {
          attendees = selectedEvent.participants;
        }
      } else {
        // Real mode fetch from server
        try {
          attendees = await fetchEventAttendeeList(userId, eventId);
          if (!attendees) attendees = [];
        } catch (error) {
          console.error('Error fetching data from server:', error);
          attendees = [];
        }
      }

      setAllAttendees(attendees);
      setHasData(attendees.length > 0);
    } catch (error) {
      console.error('Error fetching attendee details:', error);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * UseFocusEffect: fetch the data once per screen focus or event change.
   */
  useFocusEffect(
    useCallback(() => {
      clearLocalData();
      return () => {};
    }, [eventId])
  );

  /**
   * If you need to re-fetch on certain triggers (e.g. refreshList, attendeesRefreshKey):
   */
  useEffect(() => {
    fetchAllEventAttendeeDetails();
  }, [refreshList, isDemoMode, attendeesRefreshKey]);

  /**
   * 2) Memoized filtering on the client side,
   *    using the debounced value instead of the raw searchQuery.
   */
  const filteredData = useMemo(() => {
    let filteredAttendees = [...allAttendees];

    // Filter by status
    if (filterCriteria.status === 'checked-in') {
      filteredAttendees = filteredAttendees.filter(a => a.attendee_status == 1);
    } else if (filterCriteria.status === 'not-checked-in') {
      filteredAttendees = filteredAttendees.filter(a => a.attendee_status == 0);
    }

    // Sort by status (checked-in to bottom, for example)
    filteredAttendees.sort((a, b) => a.attendee_status - b.attendee_status);

    // If debouncedSearchQuery is non-empty, filter by name + possibly company
    const q = debouncedSearchQuery.trim().toLowerCase();
    if (q) {
      filteredAttendees = filteredAttendees.filter(attendee => {
        let combinedText = `${attendee.first_name} ${attendee.last_name}`.toLowerCase();

        if (isSearchByCompanyMode && attendee.organization) {
          combinedText += ` ${attendee.organization.toLowerCase()}`;
        }
        return combinedText.includes(q);
      });
    }

    return filteredAttendees;
  }, [allAttendees, debouncedSearchQuery, filterCriteria, isSearchByCompanyMode]);

  /**
   * Update a single attendee on the server (and locally).
   */
  const handleUpdateAttendee = async updatedAttendee => {
    try {
      // Update local list in memory
      const updatedAttendees = allAttendees.map(attendee =>
        attendee.id === updatedAttendee.id ? updatedAttendee : attendee
      );
      setAllAttendees(updatedAttendees);

      // Make server call
      const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${updatedAttendee.event_id}&attendee_id=${updatedAttendee.id}&attendee_status=${updatedAttendee.attendee_status}`;
      await axios.post(url);

      // Trigger any external refresh logic
      triggerListRefresh();
      onTriggerRefresh?.();
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
              searchQuery={debouncedSearchQuery} // or just pass searchQuery
              onUpdateAttendee={handleUpdateAttendee}
              onSwipeableOpen={handleSwipeableOpen}
            />
          )}
          // 3) Optional FlatList performance tweaks (especially for large lists):
          windowSize={10}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          removeClippedSubviews
        />
      ) : (
        <EmptyView handleRetry={undefined}/>
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
