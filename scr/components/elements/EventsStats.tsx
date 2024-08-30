import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../colors/colors';

const EventsStats = ({Avenir, Passees, Evenement, width1, width2, width3}) => {
  return (
    <View style={styles.stats}>
      <Text style={styles.title}>Évènement:</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statsTextContainer}>
          <Text style={styles.text}>{Avenir}</Text>
        </View>
        <View
          style={[
            styles.bar,
            {backgroundColor: colors.greyCream, width: width1},
          ]}
        />
        <Text style={styles.text}>À venir</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statsTextContainer}>
          <Text style={styles.text}>{Passees}</Text>
        </View>
        <View
          style={[styles.bar, {backgroundColor: colors.green, width: width2}]}
        />
        <Text style={styles.text}>Passées</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statsTextContainer}>
          <Text style={styles.text}>{Evenement}</Text>
        </View>
        <View
          style={[
            styles.bar,
            {backgroundColor: colors.darkGrey, width: width3},
          ]}
        />
        <Text style={styles.text}>Évènement</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stats: {},
  bar: {
    height: 9,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 15,
    marginTop: 3,
    width: 9,
  },
  statsContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  statsTextContainer: {
    width: 35,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: colors.darkGrey,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default EventsStats;
