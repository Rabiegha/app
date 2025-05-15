// AppliquerButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import { AppliquerButtonProps } from './AppliquerButton.types';

/**
 * Apply button component with green background
 */
const AppliquerButton: React.FC<AppliquerButtonProps> = ({ onPress, Titre, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{Titre}</Text>
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');

/**
 * Styles for the AppliquerButton component
 */
const styles = StyleSheet.create<{
  button: ViewStyle;
  buttonText: TextStyle;
}>({
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
