// LogOutButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import Icons from '@/assets/images/icons';
import { LogOutButtonProps } from './LogOutButton.types';

/**
 * Button component for logging out
 */
const LogOutButton: React.FC<LogOutButtonProps> = ({ onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Image
        source={Icons.LogOut}
        resizeMode="contain"
        style={{
          width: 17,
          height: 17,
          tintColor: colors.red,
          marginRight: 10,
        }}
      />
      <Text style={styles.buttonText}>Log out</Text>
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');

/**
 * Styles for the LogOutButton component
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
    borderColor: colors.red,
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LogOutButton;
