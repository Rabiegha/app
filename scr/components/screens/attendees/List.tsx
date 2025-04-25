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
import { useEvent } from '../../../context/EventContext';
import colors from '../../../assets/colors/colors';
import { AuthContext } from '../../../context/AuthContext.tsx';
import ListItem from './ListItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../redux/selectors/auth/authSelectors';
import EmptyView from '../../elements/view/EmptyView.tsx';
import LoadingView from '../../elements/view/LoadingView.tsx';
import ErrorView from '../../elements/view/ErrorView.tsx';
import { fetchMainAttendees } from '../../../redux/thunks/attendee/mainAttendeesThunk.tsx';
import { updateAttendee } from '../../../redux/thunks/attendee/updateAttendeeThunk.tsx';
import { updateAttendeeLocally } from '../../../redux/slices/attendee/attendeesListSlice.tsx';

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

const List = forwardRef<ListHandle, Props>(({ searchQuery, onTriggerRefresh, filterCriteria }, ref) => {
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
    () => totalFilteredData.slice(0, visibleCount),
    [totalFilteredData, visibleCount]
  );

  const handleUpdateAttendee = async updatedAttendee => {
    dispatch(updateAttendeeLocally(updatedAttendee));
    await dispatch(updateAttendee(updatedAttendee));
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
    if (visibleCount >= totalFilteredData.length || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 50);
      setIsLoadingMore(false);
    }, 500);
  };

  if (isLoadingList) return <LoadingView />;
  if (error) return <ErrorView handleRetry={handleRefresh} />;

  return (
    <View style={styles.list}>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            searchQuery={debouncedSearchQuery}
            onUpdateAttendee={handleUpdateAttendee}
            onSwipeableOpen={handleSwipeableOpen}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyView handleRetry={handleRefresh} text={'Aucun participant'} />
          </View>
        }
        ListFooterComponent={
          isLoadingMore && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.green} />
            </View>
          )
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    paddingBottom: 120,
  },
  contentContainer: {
    paddingBottom: 300,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default List;
