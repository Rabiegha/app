import { StyleProp, ViewStyle, TextStyle } from 'react-native';

/**
 * Country data structure for phone input
 */
export interface CountryData {
  /**
   * Country name
   */
  name: string;
  
  /**
   * Country code (e.g., 'FR', 'US')
   */
  code: string;
  
  /**
   * Dial code with plus sign (e.g., '+33', '+1')
   */
  dial_code: string;
  
  /**
   * Flag emoji for the country
   */
  flag: string;
}

/**
 * Props for the PhoneInput component
 */
export interface PhoneInputProps {
  /**
   * Current phone number value
   */
  phoneNumber: string;
  
  /**
   * Function to call when the phone number changes
   */
  onChangeText: (text: string) => void;
  
  /**
   * Placeholder text for the phone number input
   */
  placeholder?: string;
  
  /**
   * Color for the placeholder text
   */
  placeholderTextColor?: string;
  
  /**
   * Optional custom styles for the container
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Optional custom styles for the input
   */
  inputStyle?: StyleProp<TextStyle>;
}
