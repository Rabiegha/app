import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import SessionAttendeeListItem from './SessionAttendeeListItem';
import SessionStats from '../../sessionAttendeeList/SessionStatsComponent';
import ProgressBar from '../../../elements/progress/ProgressBar';
import BaseAttendeeList from '../../../common/attendee/BaseAttendeeList';
import { ListHandle } from '../../../common/attendee/types/attendeeList.types';

type Props = {
  searchQuery: string;
  handleRefresh?: () => void;
  refreshing?: boolean;
  attendees: any[];
  isLoading: boolean;
  error: boolean;
  ratio: number;
  capacity?: number;
  totalCheckedIn?: number;
};

const SessionAttendeeList = forwardRef<ListHandle, Props>(
  ({
    handleRefresh,
    refreshing,
    attendees,
    isLoading,
    error,
    capacity,
    ratio,
    totalCheckedIn,
    searchQuery,
  }, ref) => {
    return (
      <BaseAttendeeList
        ref={ref}
        searchQuery={searchQuery}
        onTriggerRefresh={handleRefresh}
        refreshing={refreshing}
        attendees={attendees}
        isLoading={isLoading}
        error={error}
        renderItem={(item) => (
          <SessionAttendeeListItem
            item={item}
            searchQuery={searchQuery}
            onUpdateAttendee={async (attendee) => {
              // Implement any session-specific update logic here if needed
              // This is a placeholder for any future implementation
            }}
          />
        )}
      >
        <View style={styles.statsContainer}>
          <SessionStats scannedCount={totalCheckedIn} totalCount={capacity} />
          <ProgressBar progress={ratio} />
        </View>
      </BaseAttendeeList>
    );
  }
);

const styles = StyleSheet.create({
  statsContainer: {
    paddingHorizontal: 10,
  },
});

export default SessionAttendeeList;
