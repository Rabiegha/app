import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the LabelValueComponent
 */
export interface LabelValueProps {
  /**
   * Label text to display
   */
  label: string;
  
  /**
   * Primary value text to display
   */
  value: string;
  
  /**
   * Optional secondary value text to display
   */
  value2?: string;
  
  /**
   * Whether to show the edit button
   */
  showButton?: boolean;
  
  /**
   * Function to call when the edit button is pressed
   */
  modifyHandle?: () => void;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
