import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

/**
 * Props for the CustomInput component
 */
export interface CustomInputProps extends Omit<TextInputProps, 'style'> {
  /**
   * Label text to display above the input
   */
  label: string;
  
  /**
   * Current value of the input
   */
  value: string;
  
  /**
   * Function to call when the input text changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Whether the input has an error
   */
  error?: boolean;
  
  /**
   * Error message to display when error is true
   */
  errorMessage?: string;
  
  /**
   * Optional custom styles for the container
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Optional custom styles for the input
   */
  inputStyle?: StyleProp<TextStyle>;
  
  /**
   * Optional custom styles for the label
   */
  labelStyle?: StyleProp<TextStyle>;
  
  /**
   * Optional custom styles for the error message
   */
  errorStyle?: StyleProp<TextStyle>;
}
