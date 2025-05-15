// RedBorderButton.ts
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';

const RedBorderButton = ({ onPress, Titre, color, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {borderColor: color},
        style // <-- Merge parent style here
      ]}
    >
      <Text style={[styles.buttonText, { color }]}>{Titre}</Text>
    </TouchableOpacity>
  );
};

export default RedBorderButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 7,
    borderWidth: 1,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
