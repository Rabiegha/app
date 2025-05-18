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
import { useEvent } from '../../../../context/EventContext';
import colors from '../../../../assets/colors/colors';
import { AuthContext } from '../../../../context/AuthContext';
import ListItem from './MainAttendeeListItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../../redux/selectors/auth/authSelectors';
import EmptyView from '../../../elements/view/EmptyView';
import LoadingView from '../../../elements/view/LoadingView';
import ErrorView from '../../../elements/view/ErrorView';

import { updateAttendee } from '../../../../redux/thunks/attendee/updateAttendeeThunk';
import { updateAttendeeLocally } from '../../../../redux/slices/attendee/attendeesListSlice';
import BaseFlatList from '../../../elements/list/BaseFlatList';
import { Attendee } from '../../../../types/attendee.types';
import { fetchAttendeesList } from '@/redux/slices/attendee/attendeeSlice';


interface FilterCriteria {
  status: string;
  [key: string]: any;
}

type Props = {
  searchQuery: string;
  onTriggerRefresh?: () => void;
  filterCriteria: FilterCriteria;
  onShowNotification?: () => void;
  summary?: any;
};

export type ListHandle = {
  handleRefresh: () => void;
};

const MainAttendeeListItem = forwardRef<ListHandle, Props>(({ searchQuery, onTriggerRefresh, filterCriteria }, ref) => {
  const dispatch = useDispatch();
  const event = useEvent();
  const eventId = event ? event.eventId : undefined;
  const { isDemoMode } = useContext(AuthContext);
  const userId = useSelector(selectCurrentUserId);
  const { list: allAttendees, isLoadingList, error } = useSelector((state: any) => state.attendee);

  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openSwipeable, setOpenSwipeable] = useState<React.RefObject<any> | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const simulateEmpty = false;

  const isSearchByCompanyMode = true;
  const deferredQuery = useDeferredValue(debouncedSearchQuery);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchAttendeesList({ userId, eventId, isDemoMode }));
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
    if (!allAttendees) return [];
    
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


  const   handleUpdateAttendee = async (updatedAttendee: Attendee) => {
    dispatch(updateAttendeeLocally(updatedAttendee));
    const result = await dispatch(updateAttendee(updatedAttendee));
    openSwipeable?.current?.close();
    onTriggerRefresh?.();
  };


  const handleSwipeableOpen = (swipeable: React.RefObject<any>) => {
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
    <View style={styles.listContainer}>
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
  listContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

export default MainAttendeeListItem;
