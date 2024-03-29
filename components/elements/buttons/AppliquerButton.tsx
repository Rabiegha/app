// CustomButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import colors from '../../../colors/colors';
import {Image} from 'react-native';

const AppliquerButton = ({onPress, Titre}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{Titre}</Text>
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
    height: 50,
    marginBottom: 15,
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.greyCream,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AppliquerButton;
