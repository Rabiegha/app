// components/screens/attendees/SessionStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../../assets/colors/colors';

const SessionStats = ({ scannedCount, totalCount }: { scannedCount: number, totalCount: number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {scannedCount} / {totalCount} participants scannés
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.darkGrey,
    fontWeight: '600',
  },
});

export default SessionStats;
