// CustomButton.js
import React from 'react';
import {TouchableOpacity, StyleSheet, Dimensions, Image} from 'react-native';
import colors from '../../../assets/colors/colors';

const SmallButton = ({
  imageSource,
  pressHandler,
  backgroundColor,
  tintColor,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {tintColor}, {backgroundColor}]}
      onPress={pressHandler}>
      {imageSource && (
        <Image source={imageSource} style={[styles.image, {tintColor}]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    marginHorizontal: 8,
    height: 45,
    marginBottom: 10,
  },
  image: {
    width: 28,
    height: 28,
  },
});

export default SmallButton;
