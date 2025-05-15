import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the ScanButton component
 */
export interface ScanButtonProps {
  /**
   * Content to render inside the button
   */
  children: ReactNode;
  
  /**
   * Function to call when the button is pressed
   */
  onPress: () => void;
  
  /**
   * Optional custom styles for the container
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Optional custom styles for the button
   */
  buttonStyle?: StyleProp<ViewStyle>;
}
