import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
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
import { updateAttendeeLocally } from '../../../redux/slices/attendee/attendeesListSlice.tsx';
import LoadingView from '../../elements/view/LoadingView.tsx';
// or if you’re directly accessing state.search.isSearchByCompanyMode, see code below

const List = ({searchQuery, onTriggerRefresh, filterCriteria}) => {

  const dispatch = useDispatch();
  const [openSwipeable, setOpenSwipeable] = useState(null);
  const {eventId, attendeesRefreshKey} = useEvent();
  const [hasData, setHasData] = useState(false);
  const { isLoadingList, data: allAttendees } = useSelector(state => state.attendees);
  const {isDemoMode} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);


  // Pull userId from Redux
  const userId = useSelector(selectCurrentUserId);
  // If you have a “search by company” mode, wire it here; for now just “false”:
  const isSearchByCompanyMode = true;

  /**
   * 1) Debounce logic: track a “debouncedSearchQuery” that updates
   *    only after the user stops typing for 300ms.
   */
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 200); // Wait 300ms after the last keystroke

    return () => {
      clearTimeout(handler); // Clear on unmount or re-run
    };
  }, [searchQuery]);

  useEffect(() => {
    handleRefresh();
  } ,[userId, eventId, isDemoMode]);

  const deferredQuery = useDeferredValue(debouncedSearchQuery);



  const totalFilteredData = useMemo(() => {
    let filtered = [...allAttendees];

    if (filterCriteria.status === 'checked-in') {
      filtered = filtered.filter(a => a.attendee_status == 1);
    } else if (filterCriteria.status === 'not-checked-in') {
      filtered = filtered.filter(a => a.attendee_status == 0);
    }

    const q = deferredQuery.trim().toLowerCase();
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filtered = filtered.filter(attendee => {
        let fullText = `${attendee.first_name} ${attendee.last_name}`;
        if (isSearchByCompanyMode && attendee.organization) {
          fullText += ` ${attendee.organization}`;
        }
        return regex.test(fullText);
      });
    }

    filtered.sort((a, b) => a.attendee_status - b.attendee_status);

    return filtered;
  }, [allAttendees, deferredQuery, filterCriteria, isSearchByCompanyMode]);

  const filteredData = useMemo(
    () => totalFilteredData.slice(0, visibleCount),
    [totalFilteredData, visibleCount]
  );

  // Gérer la mise à jour d'un participant
  const handleUpdateAttendee = async updatedAttendee => {
    dispatch(updateAttendeeLocally(updatedAttendee)); // Optimistic
    await dispatch(updateAttendee(updatedAttendee));
    openSwipeable?.current?.close();
    onTriggerRefresh?.();
  };


  //Gerer l'ouverture d'un swipeable
  const handleSwipeableOpen = swipeable => {
    if (openSwipeable && openSwipeable.current && openSwipeable !== swipeable) {
      openSwipeable.current.close();
    }
    setOpenSwipeable(swipeable);
  };

  // Handle list refreshing
  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMainAttendees({ userId, eventId, isDemoMode }));
    setRefreshing(false);
    onTriggerRefresh?.();
  };


  return (
  <View style={styles.list}>
    {isLoadingList ? (
      <ActivityIndicator color={colors.green} size="large" />
    ) : (
      <>
        <FlatList
          contentContainerStyle={styles.contentContainer}
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ListItem
              item={item}
              searchQuery={debouncedSearchQuery}
              onUpdateAttendee={handleUpdateAttendee}
              onSwipeableOpen={handleSwipeableOpen}
            />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          windowSize={10}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          removeClippedSubviews
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyView handleRetry={handleRefresh} />
            </View>
          }
        />

        {/* 👇 Bouton Voir plus */}
        {filteredData.length === visibleCount && (
          <TouchableOpacity
            onPress={() => setVisibleCount(prev => prev + 50)}
            style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Voir plus</Text>
          </TouchableOpacity>
        )}
      </>
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
  loadMoreButton: {
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignSelf: 'center',
    alignItems: 'center',
  },
  loadMoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },

});
