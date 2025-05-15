import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../assets/colors/colors';

export function ScanButton({children, onPress}) {
  return (
    <TouchableOpacity style={styles.scanButtonContainer} onPress={onPress}>
      <View style={styles.scanButton}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scanButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 90,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
