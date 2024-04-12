import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../colors/colors';

const ListEvents = ({
  eventData,
  searchQuery,
  onPress,
  eventDate,
  eventType,
}) => {
  const navigation = useNavigation();

  const highlightSearch = (text, query) => {
    if (!query.trim()) {
      return <Text style={{color: 'black'}}>{text}</Text>;
    }

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts
      .filter(part => part)
      .map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={{color: colors.green, fontWeight: 'bold'}}>
            {part}
          </Text>
        ) : (
          <Text key={index} style={{color: 'black'}}>
            {part}
          </Text>
        ),
      );
  };

  return (
    <TouchableOpacity onPress={() => onPress(eventData)}>
      <View style={styles.listItemContainer}>
        <View style={styles.dateLieu}>
          <Text style={styles.dateLieuText}>{eventDate}</Text>
          <Text style={styles.dateLieuText}>{eventType}</Text>
        </View>
        <Text style={styles.itemName}>
          {highlightSearch(eventData.event_name, searchQuery)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 10,
    height: 100,
  },
  dateLieu: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderRightWidth: 0.5,
    paddingRight: 17,
    borderRightColor: colors.grey,
    maxWidth: 120,
  },
  dateLieuText: {
    textAlign: 'right',
    color: colors.grey,
    fontSize: 16,
  },
  lieu: {
    textAlign: 'right',
    color: colors.grey,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 16,
    color: colors.darkerGrey,
    fontWeight: 'bold',
    paddingLeft: 17,
    flex: 1,
  },
});

export default ListEvents;
