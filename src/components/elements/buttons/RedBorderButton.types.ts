import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the RedBorderButton component
 */
export interface RedBorderButtonProps {
  /**
   * Function to call when the button is pressed
   */
  onPress: () => void;
  
  /**
   * Text to display on the button
   */
  Titre: string;
  
  /**
   * Color for the border and text
   */
  color: string;
  
  /**
   * Optional custom styles for the button
   */
  style?: StyleProp<ViewStyle>;
}
