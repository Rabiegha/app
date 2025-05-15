import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import totalAttendeeIcon from '../../assets/images/icons/totalAttendees.png';
import checkedInIcon from '../../assets/images/icons/checkedIn.png';
import notCheckedIcon from '../../assets/images/icons/notCheckedIn.png';
import colors from '../../assets/colors/colors';

const EventDetailsPerTypeComponent = ({
  totalAttendees,
  totalCheckedIn,
  totalNotCheckedIn,
  totalAttendeesAction,
  checkedInAction,
  notCheckedOInAction,
}) => {
  const data = [
    {
      backgroundColor: colors.detailsBlue,
      label: 'Total des participants',
      value: totalAttendees,
      source: totalAttendeeIcon,
      action: totalAttendeesAction,
    },
    {
      backgroundColor: colors.detailsGreen,
      label: 'Checked In',
      value: totalCheckedIn,
      source: checkedInIcon,
      action: checkedInAction,
    },
    {
      backgroundColor: colors.detailOrange,
      label: 'Not Checked In',
      value: totalNotCheckedIn,
      source: notCheckedIcon,
      action: notCheckedOInAction,
    },
  ];
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View key={index} style={styles.elementContainer}>
            <View
              style={[
                styles.imageContainer,
                {backgroundColor: item.backgroundColor},
              ]}>
              <Image
                style={[styles.image]}
                source={item.source}
                resizeMode="contain"
              />
            </View>
            <TouchableOpacity
              onPress={item.action}
              style={styles.textContainer}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  elementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 20,
    padding: 20,
  },
  image: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
  textContainer: {
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: colors.greyCream,
    borderRadius: 20,
    width: 280,
  },
  label: {
    fontWeight: '800',
    fontSize: 16,
    color: colors.darkGrey,
  },
  value: {
    color: colors.green,
  },
});

export default EventDetailsPerTypeComponent;
