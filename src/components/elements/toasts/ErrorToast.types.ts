import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the ErrorToast component
 */
export interface ErrorToastProps {
  /**
   * Primary text to display in the toast
   */
  text1?: string;
  
  /**
   * Secondary text to display in the toast
   */
  text2?: string;
  
  /**
   * Function to call when the toast is closed
   */
  onClose?: () => void;
  
  /**
   * Custom styles for the toast container
   */
  style?: StyleProp<ViewStyle>;
}
