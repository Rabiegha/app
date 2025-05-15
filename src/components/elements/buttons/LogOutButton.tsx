// LogOutButton.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions, Image} from 'react-native';
import colors from '../../../assets/colors/colors';
import Icons from '../../../assets/images/icons';

interface LogOutButtonProps {
  onPress: () => void;
}

const LogOutButton = ({onPress}: LogOutButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
  buttonText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LogOutButton;
