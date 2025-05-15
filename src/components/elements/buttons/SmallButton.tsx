// SmallButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import { SmallButtonProps } from './SmallButton.types';

/**
 * Small button component with an icon
 */
const SmallButton: React.FC<SmallButtonProps> = ({
  imageSource,
  pressHandler,
  backgroundColor,
  tintColor,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}]}
      onPress={pressHandler}>
      {imageSource && (
        <Image source={imageSource} style={[styles.image, {tintColor}]} />
      )}
    </TouchableOpacity>
  );
};

/**
 * Styles for the SmallButton component
 */
const styles = StyleSheet.create<{
  button: ViewStyle;
  image: ImageStyle;
}>({
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
