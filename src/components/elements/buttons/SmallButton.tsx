// CustomButton.ts
import React from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';

import colors from '../../../assets/colors/colors';

const SmallButton = ({
  imageSource,
  pressHandler,
  backgroundColor,
  tintColor,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        {backgroundColor: disabled ? colors.lightGrey : backgroundColor},
        disabled && styles.disabled
      ]}
      onPress={disabled ? undefined : pressHandler}
      disabled={disabled}>
      {imageSource && (
        <Image 
          source={imageSource} 
          style={[
            styles.image, 
            {tintColor: disabled ? colors.grey : tintColor}
          ]} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 10,
    height: 45,
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 8,
    width: 55,
  },
  disabled: {
    opacity: 0.5,
  },
  image: {
    height: 28,
    width: 28,
  },
});

export default SmallButton;
