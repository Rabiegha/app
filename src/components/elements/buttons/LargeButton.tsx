// LargeButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import { LargeButtonProps } from './LargeButton.types';

/**
 * Large button component with optional loading state
 */
const LargeButton: React.FC<LargeButtonProps> = ({
  title,
  onPress,
  backgroundColor,
  loading = false,
  style,
}) => {
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

/**
 * Styles for the LargeButton component
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
