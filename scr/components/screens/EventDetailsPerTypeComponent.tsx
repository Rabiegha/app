import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import colors from '../../assets/colors/colors';
import {ScrollView} from 'react-native-gesture-handler';

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: colors.greyCream,
    borderRadius: 16,
    width: '100%',
    height: 50,
    marginBottom: 10,
    alignItems: 'center',
  },
  point: {
    borderRadius: 20,
    width: 10,
    height: 10,
  },
  left: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 10,
    color: colors.darkGrey,
  },
  value: {
    color: colors.green,
  },
  title: {
    marginLeft: 30,
    marginBottom: 20,
    fontWeight: '800',
    fontSize: 16,
  },
});

export default EventDetailsComponent;
