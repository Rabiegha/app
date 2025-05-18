import React from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  ViewStyle,
  Dimensions,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import EmptyView from '../view/EmptyView';

type BaseFlatListProps<T> = {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement;
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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
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
