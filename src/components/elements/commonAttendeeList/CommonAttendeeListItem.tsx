import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import colors from '../../../assets/colors/colors';
import {ListItemProps} from '../../../types/listItem.types';

// Define the navigation type
type RootStackParamList = {
  More: { attendeeId: number; comment: string };
  // Add other screens as needed
};

const CommonListItem = React.memo(({item, searchQuery = ''}: ListItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isSearchByCompanyMode = true;

  const highlightSearch = (text: string, query: string) => {
    const safeQuery = (query || '').trim();
    if (!safeQuery) return [text];

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
      const companyHighlighted = highlightSearch(item.organization, searchQuery);
      return (
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>{nameHighlighted}</Text>
          <Text style={styles.companyParen}> (</Text>
          <Text style={styles.companyText}>{companyHighlighted}</Text>
          <Text style={styles.companyParen}>)</Text>
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
      attendeeId: item.id,
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

export default CommonListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    marginBottom: 10,
    height: 70,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nameText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  companyParen: {
    fontSize: 12,
    color: colors.grey,
    fontStyle: 'italic',
  },
  companyText: {
    fontSize: 12,
    color: colors.grey,
    fontStyle: 'italic',
  },
  highlight: {
    color: colors.green,
    fontWeight: 'bold',
  },
});