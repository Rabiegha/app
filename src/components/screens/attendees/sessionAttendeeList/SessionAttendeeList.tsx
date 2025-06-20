import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

import ListItem from './SessionAttendeeListItem.tsx';
import EmptyView from '../../../elements/view/EmptyView.tsx';
import LoadingView from '../../../elements/view/LoadingView.tsx';
import ErrorView from '../../../elements/view/ErrorView.tsx';
import SessionStats from '../../sessionAttendeeList/SessionStatsComponent.tsx';
import ProgressBar from '../../../elements/progress/ProgressBar.tsx';
import BaseFlatList from '../../../elements/list/BaseFlatList.tsx';

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

export type ListHandle = {
  handleRefresh: () => void;
};

const SessionListAttendee = forwardRef<ListHandle, Props>(
  ({
    handleRefresh,
    refreshing,
    attendees,
    isLoading,
    error,
    capacity,
    ratio,
    totalCheckedIn,
  }, ref) => {
    if (isLoading) {
      return <LoadingView />;
    }

    if (error) {
      return <ErrorView handleRetry={handleRefresh} />;
    }

    return (
      <View style={styles.list}>
        <SessionStats scannedCount={totalCheckedIn} totalCount={capacity} />
        <ProgressBar progress={ratio} />

        <BaseFlatList
          data={attendees}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          emptyText="Aucun participant trouvé"
          ListEmptyComponent={
            <EmptyView text="Aucun participant trouvé" handleRetry={handleRefresh} />
          }
        />

      </View>
    );
  }
);


// Add display name to the component
SessionListAttendee.displayName = 'SessionListAttendee';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default SessionListAttendee;
