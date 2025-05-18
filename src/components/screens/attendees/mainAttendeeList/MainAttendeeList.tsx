import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useEvent } from '../../../../context/EventContext';
import { AuthContext } from '../../../../context/AuthContext';
import ListItem from './MainAttendeeListItem';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../../redux/selectors/auth/authSelectors';
import EmptyView from '../../../elements/view/EmptyView';
import LoadingView from '../../../elements/view/LoadingView';
import ErrorView from '../../../elements/view/ErrorView';
import BaseFlatList from '../../../elements/list/BaseFlatList';
import { Attendee } from '../../../../types/attendee.types';
import { fetchAttendeesList } from '@/redux/slices/attendee/attendeeSlice';


// Types
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
  // Business logic handlers from parent - now required
  onUpdateAttendee: (attendee: Attendee) => Promise<void>;
  onPrintAndCheckIn: (attendee: Attendee) => Promise<void>;
  onToggleCheckIn: (attendee: Attendee) => Promise<void>;
};

export type ListHandle = {
  handleRefresh: () => void;
};

// Custom hooks
function useAttendeeData(userId: string | null, eventId: string | null | undefined, onRefresh?: () => void) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { list: allAttendees, isLoadingList, error } = useSelector((state: any) => state.attendee);
  
  const handleRefresh = useCallback(async () => {
    if (!userId || !eventId) return;
    
    setRefreshing(true);
    await dispatch(fetchAttendeesList({ userId, eventId }) as any);
    setRefreshing(false);
    onRefresh?.();
  }, [userId, eventId, dispatch, onRefresh]);
  
  useEffect(() => {
    handleRefresh();
  }, [userId, eventId]);
  
  return { allAttendees, isLoadingList, error, refreshing, handleRefresh };
}

function useAttendeeFiltering(allAttendees: Attendee[], searchQuery: string, filterCriteria: FilterCriteria, isSearchByCompanyMode: boolean) {
  const deferredQuery = useDeferredValue(searchQuery);
  
  return useMemo(() => {
    if (!allAttendees) return [];
    
    let filtered = [...allAttendees];

    // Apply status filter
    if (filterCriteria && filterCriteria.status === 'checked-in') {
      filtered = filtered.filter(a => a.attendee_status === 1);
    } else if (filterCriteria && filterCriteria.status === 'not-checked-in') {
      filtered = filtered.filter(a => a.attendee_status === 0);
    }

    // Apply search filter
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

    // Sort by check-in status
    filtered.sort((a, b) => a.attendee_status - b.attendee_status);
    return filtered;
  }, [allAttendees, deferredQuery, filterCriteria, isSearchByCompanyMode]);
}

const MainAttendeeList = forwardRef<ListHandle, Props>(({ 
  searchQuery, 
  onTriggerRefresh, 
  filterCriteria,
  onUpdateAttendee,
  onPrintAndCheckIn,
  onToggleCheckIn
}, ref) => {
  // Context and Redux
  const dispatch = useDispatch();
  const event = useEvent();
  const eventId = event ? event.eventId : undefined;
  const userId = useSelector(selectCurrentUserId);
  
  // Local state
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openSwipeable, setOpenSwipeable] = useState<React.RefObject<any> | null>(null);
  const [checkedInMap, setCheckedInMap] = useState<Record<string | number, boolean>>({});
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  // Configuration
  const isSearchByCompanyMode = true;
  const simulateEmpty = false;
  
  // Use custom hooks for data fetching and filtering
  const { 
    allAttendees, 
    isLoadingList, 
    error, 
    refreshing, 
    handleRefresh 
  } = useAttendeeData(userId, eventId, onTriggerRefresh);
  
  // Expose refresh method to parent via ref
  useImperativeHandle(ref, () => ({
    handleRefresh: () => {
      handleRefresh();
      onTriggerRefresh?.();
    },
  }));
  
  // Search query debouncing
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchQuery(searchQuery), 200);
    return () => clearTimeout(timeout);
  }, [searchQuery]);
  
  // Initialize checked-in map when attendees list changes
  useEffect(() => {
    if (allAttendees && allAttendees.length > 0) {
      const newCheckedInMap = allAttendees.reduce((acc: Record<string | number, boolean>, attendee: Attendee) => {
        acc[attendee.id] = attendee.attendee_status === 1;
        return acc;
      }, {} as Record<string | number, boolean>);
      setCheckedInMap(newCheckedInMap);
    }
  }, [allAttendees]);
  
  // Filter and process attendee data
  const totalFilteredData = useAttendeeFiltering(
    allAttendees, 
    debouncedSearchQuery, 
    filterCriteria || { status: '' }, 
    isSearchByCompanyMode
  );
  
  // Paginate the data
  const filteredData = useMemo(
    () => (simulateEmpty ? [] : totalFilteredData.slice(0, visibleCount)),
    [totalFilteredData, visibleCount, simulateEmpty]
  );


  // Update local checked-in map when attendees change
  useEffect(() => {
    if (allAttendees && allAttendees.length > 0) {
      const newCheckedInMap = allAttendees.reduce((acc: Record<string | number, boolean>, attendee: Attendee) => {
        acc[attendee.id] = attendee.attendee_status === 1;
        return acc;
      }, {} as Record<string | number, boolean>);
      setCheckedInMap(newCheckedInMap);
    }
  }, [allAttendees]);
  
  // Handle swipeable open/close
  const handleSwipeableOpen = useCallback((swipeable: React.RefObject<any>) => {
    if (openSwipeable && openSwipeable.current && openSwipeable !== swipeable) {
      openSwipeable.current.close();
    }
    setOpenSwipeable(swipeable);
  }, [openSwipeable]);
  
  // Close swipeable after update
  const handleAttendeeUpdate = useCallback(async (attendee: Attendee) => {
    await onUpdateAttendee(attendee);
    openSwipeable?.current?.close();
    
    // Update local checked-in state
    setCheckedInMap(prev => ({
      ...prev,
      [attendee.id]: attendee.attendee_status === 1
    }));
  }, [onUpdateAttendee, openSwipeable]);


  // Load more items when scrolling
  const handleLoadMore = useCallback(() => {
    if (visibleCount >= totalFilteredData.length || isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 50);
      setIsLoadingMore(false);
    }, 500);
  }, [visibleCount, totalFilteredData.length, isLoadingMore]);

  // Render based on loading/error state
  if (isLoadingList) {
    return (
      <View style={styles.viewsContainer}>
        <LoadingView />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.viewsContainer}>
        <ErrorView handleRetry={handleRefresh} />
      </View>
    );
  }

  // Main list render
  return (
    <View style={styles.listContainer}>
      <BaseFlatList<Attendee>
        data={filteredData}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            searchQuery={debouncedSearchQuery}
            isCheckedIn={checkedInMap[item.id] || false}
            isSearchByCompanyMode={isSearchByCompanyMode}
            onSwipeableOpen={handleSwipeableOpen}
            onPrintAndCheckIn={onPrintAndCheckIn}
            onToggleCheckIn={onToggleCheckIn}
          />
        )}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={() => {
          handleRefresh();
          onTriggerRefresh?.();
        }}
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

// Styles
const styles = StyleSheet.create({
  viewsContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

export default MainAttendeeList;
