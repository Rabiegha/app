import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import colors from '../../assets/colors/colors';
import { ScanButtonProps } from './scanButton.types';

/**
 * Button component for the scan action in the tab bar
 */
export function ScanButton({ children, onPress, containerStyle, buttonStyle }: ScanButtonProps) {
  return (
    <TouchableOpacity style={[styles.scanButtonContainer, containerStyle]} onPress={onPress}>
      <View style={[styles.scanButton, buttonStyle]}>{children}</View>
    </TouchableOpacity>
  );
}

/**
 * Styles for the ScanButton component
 */
const styles = StyleSheet.create<{
  scanButtonContainer: ViewStyle;
  scanButton: ViewStyle;
}>({
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
