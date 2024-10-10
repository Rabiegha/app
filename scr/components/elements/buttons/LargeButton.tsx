// LargeButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import colors from '../../../../colors/colors';

const LargeButton = ({title, onPress, backgroundColor, loading}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}]}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginHorizontal: 20,
    height: 50,
    marginBottom: 7,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LargeButton;
