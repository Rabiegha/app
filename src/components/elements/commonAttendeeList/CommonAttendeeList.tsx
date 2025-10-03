import React, {forwardRef} from 'react';
import {StyleSheet, View} from 'react-native';

import EmptyView from '../../elements/view/EmptyView';
import LoadingView from '../../elements/view/LoadingView';
import ErrorView from '../../elements/view/ErrorView';
import BaseFlatList from '../../elements/list/BaseFlatList';
import { Attendee } from '../../../types/attendee.types.ts';

import CommonListItem from './CommonAttendeeListItem';

type Props = {
  searchQuery: string;
  handleRefresh?: () => void;
  refreshing?: boolean;
  attendees: Attendee[];
  isLoading: boolean;
  error: boolean;
};

export type ListHandle = {
  handleRefresh: () => void;
};

const CommonAttendeeList = forwardRef<ListHandle, Props>(
  ({searchQuery, handleRefresh, refreshing, attendees, isLoading, error}) => {
    if (isLoading) return <LoadingView />;
    if (error) return <ErrorView handleRetry={handleRefresh} />;

    return (
      <View style={styles.list}>
        <BaseFlatList
          data={attendees}
          renderItem={({item}) => <CommonListItem item={item} searchQuery={searchQuery} />}
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
CommonAttendeeList.displayName = 'CommonAttendeeList';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default CommonAttendeeList;
