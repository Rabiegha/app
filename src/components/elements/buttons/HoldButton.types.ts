import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the HoldButton component
 */
export interface HoldButtonProps {
  /**
   * Text to display on the button
   */
  title: string;
  
  /**
   * Function to call when the button is held for the specified duration
   */
  onPress: () => void;
  
  /**
   * Background color of the button in its default state
   */
  backgroundColor: string;
  
  /**
   * Color to change to during hold
   * @default colors.lightGreen
   */
  holdColor?: string;
  
  /**
   * Duration in milliseconds that the button needs to be held
   * @default 3000
   */
  holdDuration?: number;
  
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  
  /**
   * Optional custom styles for the button
   */
  style?: StyleProp<ViewStyle>;
}
