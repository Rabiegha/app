import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../../colors/colors';

const ProgressText = ({totalCheckedAttendees, totalAttendees}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>{totalCheckedAttendees}/{totalAttendees}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGrey,
  },
});

export default ProgressText;
