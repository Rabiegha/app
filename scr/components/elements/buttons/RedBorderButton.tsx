// CustomButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import colors from '../../../assets/colors/colors';
import {Image} from 'react-native';

const RedBorderButton = ({onPress, Titre}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{Titre}</Text>
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    backgroundColor: 0,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: colors.red,
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RedBorderButton;
