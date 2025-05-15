/**
 * Common types used across the application
 */

// Common button props
export interface BaseButtonProps {
  onPress: () => void;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
}

// Common component props with children
export interface WithChildrenProps {
  children: React.ReactNode;
}

// Common modal props
export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
}

// Common notification props
export interface BaseNotificationProps {
  text: string;
  onClose: () => void;
}

// Common form field props
export interface BaseFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

// Common list item props
export interface BaseListItemProps<T> {
  item: T;
  onPress?: (item: T) => void;
}

// Common icon props
export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

// Common style props
export interface StyleProps {
  style?: React.CSSProperties;
}

// Common event handler types
export type PressHandler = () => void;
export type ChangeHandler<T> = (value: T) => void;
