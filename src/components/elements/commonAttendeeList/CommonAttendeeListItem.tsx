import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import colors from '../../../assets/colors/colors';
import {ListItemProps} from '../../../types/listItem.types';

// Define the navigation type
type RootStackParamList = {
  More: { attendeeId: string; comment: string };
  // Add other screens as needed
};

const CommonListItem = React.memo(({item, searchQuery = ''}: Omit<ListItemProps, 'onUpdateAttendee'> & Partial<Pick<ListItemProps, 'onUpdateAttendee'>>) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isSearchByCompanyMode = true;

  const highlightSearch = (text: string, query: string): React.ReactNode => {
    const safeQuery = (query || '').trim();
    if (!safeQuery) return text;

    const regex = new RegExp(`(${safeQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.filter(Boolean).map((part, index) => (
      <Text key={index} style={regex.test(part) ? styles.highlight : undefined}>
        {part}
      </Text>
    ));
  };

  const renderNameWithOptionalCompany = () => {
    const nameHighlighted = highlightSearch(
      `${item.first_name} ${item.last_name}`,
      searchQuery
    );


    const shouldShowCompany =
      isSearchByCompanyMode && item.organization && searchQuery.trim() !== '';

    if (shouldShowCompany) {
      const companyHighlighted = highlightSearch(item.organization || '', searchQuery);
      return (
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>{nameHighlighted}</Text>
          <Text style={styles.companyText}> ({companyHighlighted})</Text>
        </View>
      );
    }

    return (
      <View style={styles.nameRow}>
        <Text style={styles.nameText}>{nameHighlighted}</Text>
      </View>
    );
  };

  const handleItemPress = () => {
    navigation.navigate('More', {
      attendeeId: String(item.id), // Convert to string to match MoreScreen expectations
      comment: item.comment || '',
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleItemPress} accessible={false}>
      <View style={styles.listItemContainer}>
        <View style={styles.contentContainer}>{renderNameWithOptionalCompany()}</View>
      </View>
    </TouchableWithoutFeedback>
  );
});

CommonListItem.displayName = 'CommonListItem';

export default CommonListItem;

const styles = StyleSheet.create({
  companyText: {
    color: colors.grey,
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  highlight: {
    color: colors.green,
    fontWeight: 'bold',
  },
  listItemContainer: {
    alignItems: 'center',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    flexDirection: 'row',
    height: 70,
    marginBottom: 10,
    overflow: 'hidden',
  },
  nameRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nameText: {
    color: colors.darkGrey,
    fontSize: 16,
    fontWeight: '500',
  },
});