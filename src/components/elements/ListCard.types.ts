import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the ListCard component
 */
export interface ListCardProps {
  /**
   * Main title text for the card
   */
  title: string;
  
  /**
   * First subtitle text (optional)
   */
  subtitle1?: string;
  
  /**
   * Second subtitle text (optional)
   */
  subtitle2?: string;
  
  /**
   * Function to call when the card is pressed
   */
  onPress: () => void;
  
  /**
   * Optional custom styles for the card container
   */
  style?: StyleProp<ViewStyle>;
}
