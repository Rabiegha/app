import React, {
  forwardRef,
} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import ListItem from './SessionAttendeeListItem.tsx';
import EmptyView from '../../../elements/view/EmptyView.tsx';
import LoadingView from '../../../elements/view/LoadingView.tsx';
import ErrorView from '../../../elements/view/ErrorView.tsx';
import SessionStats from '../../sessionAttendeeList/SessionStatsComponent.tsx';
import ProgressBar from '../../../elements/progress/ProgressBar.tsx';
import colors from '../../../../assets/colors/colors.tsx';

type Props = {
  searchQuery: string;
  handleRefresh?: () => void;
  ratio: any;
  onShowNotification?: () => void;
  capacity?: any;
  totalCheckedIn?:any;
};

export type ListHandle = {
  handleRefresh: () => void;
};

const SessionListAttendee = forwardRef<ListHandle, Props>(({ handleRefresh, capacity, ratio, totalCheckedIn, refreshing, attendees, isLoading, error }, ref) => {


  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingView />
      </View>
    );
  }

  if (error) {return(
    <View style={{ flex: 1 }}>
      <ErrorView handleRetry={handleRefresh} />
    </View> );}


  return (
    <View style={styles.list}>
      <SessionStats scannedCount={totalCheckedIn} totalCount={capacity} />
            <ProgressBar progress={ratio} />
            <FlatList
                data={attendees}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ListItem item={item} />}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={{
                  paddingBottom: 250, // 🟢 Important for scrolling above bottom navbar
                  flexGrow: attendees.length === 0 ? 1 : undefined,
                  minHeight: attendees.length === 0 ? 500 : undefined,
                }}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucun participant pour cette session.</Text>
                  </View>
                }
              />
    </View>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 300,
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
  },
});

export default SessionListAttendee;

