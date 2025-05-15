import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useEvent } from '../../../../context/EventContext.tsx';
import colors from '../../../../assets/colors/colors.tsx';
import { AuthContext } from '../../../../context/AuthContext.tsx';
import ListItem from './MainAttendeeListItem.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../../redux/selectors/auth/authSelectors.tsx';
import EmptyView from '../../../elements/view/EmptyView.tsx';
import LoadingView from '../../../elements/view/LoadingView.tsx';
import ErrorView from '../../../elements/view/ErrorView.tsx';
import { fetchMainAttendees } from '../../../../redux/thunks/attendee/mainAttendeesThunk.tsx';
import { updateAttendee } from '../../../../redux/thunks/attendee/updateAttendeeThunk.tsx';
import { updateAttendeeLocally } from '../../../../redux/slices/attendee/attendeesListSlice.tsx';
import BaseFlatList from '../../../elements/list/BaseFlatList.tsx';
import { Attendee } from '../../../../types/attendee.types.ts';
import Toast from 'react-native-toast-message';


type Props = {
  searchQuery: string;
  onTriggerRefresh?: () => void;
  filterCriteria: any;
  onShowNotification?: () => void;
  summary?: any;
};

export type ListHandle = {
  handleRefresh: () => void;
};

const MainAttendeeListItem = forwardRef<ListHandle, Props>(({ searchQuery, onTriggerRefresh, filterCriteria }, ref) => {
  const dispatch = useDispatch();
  const { eventId } = useEvent();
  const { isDemoMode } = useContext(AuthContext);
  const userId = useSelector(selectCurrentUserId);
  const { data: allAttendees, isLoadingList, error } = useSelector((state: any) => state.attendees);

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openSwipeable, setOpenSwipeable] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const simulateEmpty = false;

  const isSearchByCompanyMode = true;
  const deferredQuery = useDeferredValue(debouncedSearchQuery);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchMainAttendees({ userId, eventId, isDemoMode }));
    setRefreshing(false);
    onTriggerRefresh?.();
  };

  useImperativeHandle(ref, () => ({
    handleRefresh,
  }));

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchQuery(searchQuery), 200);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    handleRefresh();
  }, [userId, eventId, isDemoMode]);

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
  }, [allAttendees, deferredQuery, filterCriteria]);

  const filteredData = useMemo(
    () => (simulateEmpty ? [] : totalFilteredData.slice(0, visibleCount)),
    [totalFilteredData, visibleCount]
  );


  const handleUpdateAttendee = async updatedAttendee => {
    dispatch(updateAttendeeLocally(updatedAttendee));
    const result = await dispatch(updateAttendee(updatedAttendee));

    
  
    if (updatedAttendee.attendee_status == 1 && updateAttendee.fulfilled.match(result)) {
      Toast.show({
        type: 'customSuccess',
        text1: 'Participant mis à jour ',
        text2: `${updatedAttendee.first_name} ${updatedAttendee.last_name}`,
      });
    }
  
    openSwipeable?.current?.close();
    onTriggerRefresh?.();
  };
  

  const handleSwipeableOpen = swipeable => {
    if (openSwipeable && openSwipeable.current && openSwipeable !== swipeable) {
      openSwipeable.current.close();
    }
    setOpenSwipeable(swipeable);
  };

  const handleLoadMore = () => {
    if (visibleCount >= totalFilteredData.length || isLoadingMore) {return;}
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 50);
      setIsLoadingMore(false);
    }, 500);
  };

  if (isLoadingList) {
    return (
      <View style={styles.viewsContainer}>
        <LoadingView />
      </View>
    );
  }

  if (error) {return (
      <View style={styles.viewsContainer}>
        <ErrorView handleRetry={handleRefresh} />
      </View>
      );}

  return (
    <View >
      <BaseFlatList<Attendee>
          data={filteredData}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              searchQuery={debouncedSearchQuery}
              onUpdateAttendee={handleUpdateAttendee}
              onSwipeableOpen={handleSwipeableOpen}
            />
          )}
          keyExtractor={item => item.id.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          isLoadingMore={isLoadingMore}
          footerEnabled={true}
          ListEmptyComponent={
            <View style={styles.viewsContainer}>
              <EmptyView text={''} handleRetry={handleRefresh} />
            </View>
          }
        />
    </View>
  );
});

const styles = StyleSheet.create({
  loaderContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    height: '100%',
  },
  viewsContainer: {
    flex: 1,
  },
});

export default MainAttendeeListItem;
