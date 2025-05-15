import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the SuccessComponent
 */
export interface SuccessComponentProps {
  /**
   * Function to call when the close button is pressed
   */
  onClose: () => void;
  
  /**
   * Text to display in the notification
   */
  text: string;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
