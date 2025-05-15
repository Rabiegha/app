import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the LargeButton component
 */
export interface LargeButtonProps {
  /**
   * Text to display on the button
   */
  title: string;
  
  /**
   * Function to call when the button is pressed
   */
  onPress: () => void;
  
  /**
   * Background color of the button
   */
  backgroundColor: string;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Optional custom styles for the button
   */
  style?: StyleProp<ViewStyle>;
}
