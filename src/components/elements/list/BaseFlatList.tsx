import React from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  ViewStyle,
  ListRenderItem,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import EmptyView from '../view/EmptyView';

type BaseFlatListProps<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  emptyText?: string;
  footerEnabled?: boolean;
  contentContainerStyle?: ViewStyle;
  ListEmptyComponent?: React.ReactNode;
};

function BaseFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  refreshing,
  onRefresh,
  onEndReached,
  isLoadingMore,
  emptyText = 'Aucun élément à afficher',
  footerEnabled = false,
  contentContainerStyle,
  ListEmptyComponent,
}: BaseFlatListProps<T>) {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      contentContainerStyle={{
        paddingBottom: 250,
        flexGrow: data.length === 0 ? 1 : undefined,
        minHeight: data.length === 0 ? 500 : undefined,
        ...contentContainerStyle,
      }}
      ListEmptyComponent={
        ListEmptyComponent ?? (
          <View style={styles.emptyContainer}>
            <EmptyView text={emptyText} handleRetry={undefined} />
          </View>
        )
      }
      ListFooterComponent={
        footerEnabled && isLoadingMore ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={colors.green} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default BaseFlatList;
