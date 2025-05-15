import { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';

/**
 * Props for the SmallButton component
 */
export interface SmallButtonProps {
  /**
   * Source for the button's icon image
   */
  imageSource: ImageSourcePropType;
  
  /**
   * Function to call when the button is pressed
   */
  pressHandler: () => void;
  
  /**
   * Background color of the button
   */
  backgroundColor: string;
  
  /**
   * Tint color for the button's icon
   */
  tintColor: string;
  
  /**
   * Optional custom styles for the button
   */
  style?: StyleProp<ViewStyle>;
}
