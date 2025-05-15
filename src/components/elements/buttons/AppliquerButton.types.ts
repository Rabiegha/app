import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the AppliquerButton component
 */
export interface AppliquerButtonProps {
  /**
   * Function to call when the button is pressed
   */
  onPress: () => void;
  
  /**
   * Text to display on the button
   */
  Titre: string;
  
  /**
   * Optional custom styles for the button
   */
  style?: StyleProp<ViewStyle>;
}
