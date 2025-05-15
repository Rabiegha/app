import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the TabBarIcon component
 */
export interface TabBarIconProps {
  /**
   * Icon source for the tab
   */
  icon: ImageSourcePropType;
  
  /**
   * Label text to display under the icon (optional)
   */
  label?: string;
  
  /**
   * Whether the tab is currently focused
   */
  focused: boolean;
  
  /**
   * Height of the icon (optional)
   * @default 24
   */
  height?: number;
  
  /**
   * Width of the icon (optional)
   * @default 24
   */
  width?: number;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
