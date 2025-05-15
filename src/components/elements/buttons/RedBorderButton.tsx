// RedBorderButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { RedBorderButtonProps } from './RedBorderButton.types';

/**
 * Button component with colored border and text
 */
const RedBorderButton: React.FC<RedBorderButtonProps> = ({ onPress, Titre, color, style }) => {
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

/**
 * Styles for the RedBorderButton component
 */
const styles = StyleSheet.create<{
  button: ViewStyle;
  buttonText: TextStyle;
}>({
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
