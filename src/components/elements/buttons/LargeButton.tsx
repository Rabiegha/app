// LargeButton.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native';

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
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    marginBottom: 7,
    padding: 10,
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LargeButton;
