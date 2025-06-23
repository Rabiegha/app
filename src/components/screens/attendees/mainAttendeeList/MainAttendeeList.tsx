import React, {
  useDeferredValue,
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useEvent } from '../../../../context/EventContext';
import { selectCurrentUserId } from '../../../../redux/selectors/auth/authSelectors';
import EmptyView from '../../../elements/view/EmptyView';
import LoadingView from '../../../elements/view/LoadingView';
import ErrorView from '../../../elements/view/ErrorView';
import BaseFlatList from '../../../elements/list/BaseFlatList';
import { Attendee } from '../../../../types/attendee.types';

import MainAttendeeListItem from './MainAttendeeListItem';

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


function normalizeText(text: string): string {
  return text
    .normalize("NFD") // décompose les lettres accentuées
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " "); // remplace plusieurs espaces par un seul
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
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
      const normalizedQuery = normalizeText(q);
    
      filtered = filtered.filter(attendee => {
        const names = [
          `${attendee.first_name} ${attendee.last_name}`,
          `${attendee.last_name} ${attendee.first_name}`,
        ];
    
        if (isSearchByCompanyMode && attendee.organization) {
          names.push(`${attendee.organization}`);
          names.push(`${attendee.first_name} ${attendee.last_name} ${attendee.organization}`);
        }
    
        return names.some(name => {
          const normalizedName = normalizeText(name);
          const distance = levenshtein(normalizedQuery, normalizedName);
          const maxAllowedDistance = Math.floor(normalizedQuery.length * 0.3); // tolérance de 30%
          return normalizedName.includes(normalizedQuery) || distance <= maxAllowedDistance;
        });
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


  // Update local checked-in map when attendees change - removed duplicate effect
  
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

  // Define all hooks before any conditional returns
  // Wrap the toggle check-in handler to close swipeable after action
  const handleToggleCheckInWithClose = useCallback(async (attendee: Attendee) => {
    await onToggleCheckIn(attendee);
    openSwipeable?.current?.close();
  }, [onToggleCheckIn, openSwipeable]);

  // Wrap the print and check-in handler to close swipeable after action
  const handlePrintAndCheckInWithClose = useCallback(async (attendee: Attendee) => {
    await onPrintAndCheckIn(attendee);
    openSwipeable?.current?.close();
  }, [onPrintAndCheckIn, openSwipeable]);

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
          <MainAttendeeListItem
            item={item}
            searchQuery={debouncedSearchQuery}
            isCheckedIn={checkedInMap[item.id] || false}
            isSearchByCompanyMode={isSearchByCompanyMode}
            onSwipeableOpen={handleSwipeableOpen}
            onPrintAndCheckIn={handlePrintAndCheckInWithClose}
            onToggleCheckIn={handleToggleCheckInWithClose}
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

// Add display name to the component
MainAttendeeList.displayName = 'MainAttendeeList';

// Styles
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  viewsContainer: {
    flex: 1,
  },
});

export default MainAttendeeList;
