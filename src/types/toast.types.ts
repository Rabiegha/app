import { StyleProp, ViewStyle } from 'react-native';

/**
 * Base props for all toast components
 */
export interface BaseToastProps {
  text1?: string;
  text2?: string;
  onClose?: () => void;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Props for success toast component
 */
export interface SuccessToastProps extends BaseToastProps {
  // Additional success-specific props can be added here
}

/**
 * Props for error toast component
 */
export interface ErrorToastProps extends BaseToastProps {
  // Additional error-specific props can be added here
}

/**
 * Toast position options
 */
export enum ToastPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center'
}

/**
 * Toast configuration options
 */
export interface ToastConfig {
  position?: ToastPosition;
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
}
