import React from 'react';
import { View, Switch, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import colors from '../../assets/colors/colors';
import { CustomSwitchProps } from './Switch.types';

/**
 * Custom switch component with styled track colors
 */
const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  style,
  trackColorFalse = colors.grey,
  trackColorTrue = colors.green
}) => {
  return (
    <View style={[styles.switchContainer, style]}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: trackColorFalse, true: trackColorTrue}}
      />
    </View>
  );
};

/**
 * Styles for the CustomSwitch component
 */
const styles = StyleSheet.create<{
  switchContainer: ViewStyle;
  switchLabel: TextStyle;
}>({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 16,
  },
});

export default CustomSwitch;
