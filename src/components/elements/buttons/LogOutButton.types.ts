import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the LogOutButton component
 */
export interface LogOutButtonProps {
  /**
   * Function to call when the button is pressed
   */
  onPress: () => void;
  
  /**
   * Optional custom styles for the button
   */
  style?: StyleProp<ViewStyle>;
}
