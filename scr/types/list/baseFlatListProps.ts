import { ListRenderItem, ViewStyle } from "react-native";

export type BaseFlatListProps<T> = {
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
  };
