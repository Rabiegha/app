import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the CustomSwitch component
 */
export interface CustomSwitchProps {
  /**
   * Current value of the switch
   */
  value: boolean;
  
  /**
   * Function to call when the switch value changes
   */
  onValueChange: (value: boolean) => void;
  
  /**
   * Optional custom styles for the switch container
   */
  style?: StyleProp<ViewStyle>;
  
  /**
   * Optional track color for the switch when it's off
   */
  trackColorFalse?: string;
  
  /**
   * Optional track color for the switch when it's on
   */
  trackColorTrue?: string;
}
