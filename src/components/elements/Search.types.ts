import { StyleProp, ViewStyle, TextStyle } from 'react-native';

/**
 * Props for the Search component
 */
export interface SearchProps {
  /**
   * Function to call when the search text changes
   */
  onChange: (text: string) => void;
  
  /**
   * Current value of the search input
   */
  value: string;
  
  /**
   * Optional custom styles for the search container
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Optional custom styles for the search input
   */
  inputStyle?: StyleProp<TextStyle>;
  
  /**
   * Optional placeholder text
   */
  placeholder?: string;
  
  /**
   * Optional placeholder text color
   */
  placeholderTextColor?: string;
}
