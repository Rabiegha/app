import React from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import colors from '../../assets/colors/colors';

const CustomSwitch = ({value, onValueChange}) => {
  return (
    <View style={styles.switchContainer}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: colors.grey, true: colors.green}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
