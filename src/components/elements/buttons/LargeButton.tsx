// LargeButton.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import colors from '../../../assets/colors/colors';

interface LargeButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  loading?: boolean;
}

const LargeButton = ({title, onPress, backgroundColor, loading = false}: LargeButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}]}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
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
    marginHorizontal: 20,
    height: 50,
    marginBottom: 7,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LargeButton;
