import React, {forwardRef} from 'react';
import {StyleSheet, View} from 'react-native';
import EmptyView from '../view/EmptyView.tsx';
import LoadingView from '../view/LoadingView.tsx';
import ErrorView from '../view/ErrorView.tsx';
import BaseFlatList from '../list/BaseFlatList.tsx';
import CommonListItem from './CommonAttendeeListItem.tsx';
import { Attendee } from '../../../types/attendee.types.ts';

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
  ({searchQuery, handleRefresh, refreshing, attendees, isLoading, error}, ref) => {
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

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default CommonAttendeeList;
