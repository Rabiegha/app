import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {useEvent} from '../../../context/EventContext';
import colors from '../../../assets/colors/colors';
import {AuthContext} from '../../../context/AuthContext.tsx';
import {useFocusEffect} from '@react-navigation/native';
import ListItem from './ListItem';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../../redux/selectors/auth/authSelectors';
/** NEW: If your store is set up so that “search” slice has isSearchByCompanyMode,
    import from whichever slice you have:
**/
import { selectIsSearchByCompanyMode } from '../../../redux/selectors/search/searchSelectors';
import EmptyView from '../../elements/view/EmptyView.tsx';
import { useActiveEvent } from '../../../utils/event/useActiveEvent.tsx';
import { updateAttendee } from '../../../redux/thunks/attendee/updateAttendeeThunk.tsx';
import { fetchMainAttendees } from '../../../redux/thunks/attendee/mainAttendeesThunk.tsx';
// or if you’re directly accessing state.search.isSearchByCompanyMode, see code below

const List = ({searchQuery, onTriggerRefresh, filterCriteria}) => {

  const dispatch = useDispatch();
  const [openSwipeable, setOpenSwipeable] = useState(null);
  const {refreshList, eventId, attendeesRefreshKey} = useEvent();
  const [hasData, setHasData] = useState(false);
  const { isLoading, data: allAttendees } = useSelector(state => state.attendees);
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
  const fetchAllEventAttendeeDetails = () => {
    dispatch(fetchMainAttendees({ userId, eventId, isDemoMode }));
  };

  useFocusEffect(
    useCallback(() => {
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

  // Gérer la mise à jour d'un participant
  const handleUpdateAttendee = async updatedAttendee => {
    // Mise à jour locale (optimiste) via dispatch
    dispatch(updateAttendee(updatedAttendee));
    onTriggerRefresh?.();
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
      ) : filteredData.length ? (
        <FlatList
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
