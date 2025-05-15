import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the CheckBox component
 */
export interface CheckBoxProps {
  /**
   * Whether the checkbox is checked
   */
  isChecked: boolean;
  
  /**
   * Function to call when the checkbox is pressed
   */
  onPress: () => void;
  
  /**
   * Text to display next to the checkbox
   */
  title: string;
  
  /**
   * Optional custom styles for the checkbox container
   */
  style?: StyleProp<ViewStyle>;
}
