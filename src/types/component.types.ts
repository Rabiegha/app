import { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * Props for header components
 */
export interface HeaderProps {
  title?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  RightIcon?: any; // Will be refined to proper image source type
  backgroundColor?: string;
  color?: string;
  leftButtonTintColor?: string;
  rightBottonColor?: string;
  size?: number;
}

/**
 * Props for button components
 */
export interface ButtonProps {
  title?: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Props for small button components
 */
export interface SmallButtonProps {
  imageSource: any; // Will be refined to proper image source type
  pressHandler: () => void;
  backgroundColor?: string;
  tintColor?: string;
  size?: number;
}

/**
 * Props for label-value components
 */
export interface LabelValueProps {
  label: string;
  value: string;
  value2?: string;
  showButton?: boolean;
  modifyHandle?: () => void;
}

/**
 * Props for search components
 */
export interface SearchProps {
  onChange: (text: string) => void;
  value: string;
  placeholder?: string;
}

/**
 * Props for checkbox components
 */
export interface CheckBoxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Props for notification components
 */
export interface NotificationProps {
  text: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
}
