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
import BaseFlatList from '../../../elements/list/BaseFlatList.tsx';

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
        <LoadingView />
    );
  }

  if (error) {return(
      <ErrorView handleRetry={handleRefresh} />
    );}



  return (
    <View style={styles.list}>
      <SessionStats scannedCount={totalCheckedIn} totalCount={capacity} />
            <ProgressBar progress={ratio} />
            <BaseFlatList
                data={attendees}
                renderItem={({ item }) => <ListItem item={item} />}
                keyExtractor={item => item.id.toString()}
                refreshing={refreshing}
                onRefresh={handleRefresh}
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

