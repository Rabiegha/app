import React, { forwardRef, useState, useEffect, useMemo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Attendee } from '../../../types/attendee.types';
import BaseFlatList from '../../elements/list/BaseFlatList';
import EmptyView from '../../elements/view/EmptyView';
import LoadingView from '../../elements/view/LoadingView';
import ErrorView from '../../elements/view/ErrorView';
import { BaseAttendeeListProps, ListHandle } from './types/attendeeList.types';

const BaseAttendeeList = forwardRef<ListHandle, BaseAttendeeListProps & { 
  renderItem?: (item: Attendee) => ReactNode;
  children?: ReactNode;
}>(
  ({
    searchQuery = '',
    onTriggerRefresh,
    filterCriteria = { status: 'all' },
    refreshing = false,
    attendees = [],
    isLoading = false,
    error = null,
    children,
    renderItem,
    ListEmptyComponent,
  }, ref) => {
    const [visibleCount, setVisibleCount] = useState(20);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    // Handle search query debouncing
    useEffect(() => {
      const timeout = setTimeout(() => setDebouncedSearchQuery(searchQuery), 200);
      return () => clearTimeout(timeout);
    }, [searchQuery]);

    // Filter attendees based on search query and filter criteria
    const filteredData = useMemo(() => {
      if (!attendees.length) return [];
      
      let filtered = [...attendees];

      // Apply status filter
      if (filterCriteria?.status === 'checked-in') {
        filtered = filtered.filter(a => a.attendee_status === 1);
      } else if (filterCriteria?.status === 'not-checked-in') {
        filtered = filtered.filter(a => a.attendee_status === 0);
      }

      // Apply search filter
      const q = debouncedSearchQuery.trim().toLowerCase();
      if (q) {
        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filtered = filtered.filter(attendee => {
          let fullText = `${attendee.first_name} ${attendee.last_name}`;
          if (attendee.organization) {
            fullText += ` ${attendee.organization}`;
          }
          return regex.test(fullText);
        });
      }

      // Sort by check-in status
      filtered.sort((a, b) => a.attendee_status - b.attendee_status);
      
      return filtered.slice(0, visibleCount);
    }, [attendees, debouncedSearchQuery, filterCriteria, visibleCount]);

    // Handle loading more items
    const handleLoadMore = () => {
      if (visibleCount >= attendees.length || isLoadingMore) return;
      
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount(prev => prev + 50);
        setIsLoadingMore(false);
      }, 500);
    };

    // Render loading state
    if (isLoading) {
      return (
        <View style={styles.container}>
          <LoadingView />
        </View>
      );
    }

    // Render error state
    if (error) {
      return (
        <View style={styles.container}>
          <ErrorView handleRetry={onTriggerRefresh} />
        </View>
      );
    }

    // Render the list
    return (
      <View style={styles.container}>
        {children}
        
        <BaseFlatList<Attendee>
          data={filteredData}
          renderItem={({ item }) => renderItem ? renderItem(item) : null}
          keyExtractor={item => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onTriggerRefresh}
          onEndReached={handleLoadMore}
          isLoadingMore={isLoadingMore}
          footerEnabled={true}
          ListEmptyComponent={
            ListEmptyComponent || (
              <View style={styles.emptyContainer}>
                <EmptyView text={'Aucun participant trouvé'} handleRetry={onTriggerRefresh} />
              </View>
            )
          }
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BaseAttendeeList;
