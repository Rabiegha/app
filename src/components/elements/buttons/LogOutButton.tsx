// LogOutButton.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions, Image} from 'react-native';
import colors from '../../../assets/colors/colors';
import Icons from '../../../assets/images/icons';

export interface LogOutButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const LogOutButton = ({onPress, disabled = false}: LogOutButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={Icons.LogOut}
        resizeMode="contain"
        style={{
          width: 17,
          height: 17,
          tintColor: disabled ? colors.grey : colors.red,
          marginRight: 10,
        }}
      />
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>Log out</Text>
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');

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
    borderColor: colors.red,
    flexDirection: 'row',
  },
  buttonDisabled: {
    borderColor: colors.grey,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: colors.grey,
  },
});

export default LogOutButton;
