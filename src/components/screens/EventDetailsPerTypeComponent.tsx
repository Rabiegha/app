import React, {} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import colors from '../../assets/colors/colors';

const EventDetailsComponent = ({data}) => {
  return (
    <ScrollView>
      <Text style={styles.title}>Participants par type</Text>
      {data.map((item, index) => {
        return (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.left}>
              <View
                style={[styles.point, {backgroundColor: item.background_color}]}
              />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={styles.value}>{item.y}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    backgroundColor: colors.greyCream,
    borderRadius: 16,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 30,
    width: '100%',
  },
  label: {
    color: colors.darkGrey,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 10,
  },
  left: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  point: {
    borderRadius: 20,
    height: 10,
    width: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 20,
    marginLeft: 30,
  },
  value: {
    color: colors.green,
  },
});

export default EventDetailsComponent;
