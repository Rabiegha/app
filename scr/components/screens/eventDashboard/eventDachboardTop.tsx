import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import colors from '../../../assets/colors/colors';

const EventDachboardTopComponent = () => {
  return (
    <View style={styles.container}>
      <View>
        <Image />
      </View>
      <Text style={styles.title}>eventDackbordTop</Text>
      <Text style={styles.text}>eventDackbordTop</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: colors.darkGrey,
    marginBottom: 5,
  },
  text: {
    color: colors.green,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  }
});

export default EventDachboardTopComponent;
