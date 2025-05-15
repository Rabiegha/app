import { StyleProp, ViewStyle } from 'react-native';

/**
 * Base props for all modal components
 */
export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Props for print modal component
 */
export interface PrintModalProps extends BaseModalProps {
  status?: 'printing' | 'Print successful' | 'Error printing' | 'No printer selected' | 'Sending print job' | string;
}

/**
 * Props for scan modal component
 */
export interface ScanModalProps extends BaseModalProps {
  status?: 'error' | 'approved' | 'not_found' | 'printing' | 'Print successful' | 'Error printing' | 'No printer selected' | 'Sending print job' | string;
}

/**
 * Props for modify field modal
 */
export interface ModifyFieldModalProps extends BaseModalProps {
  fieldKey?: string;
  fieldLabel?: string;
  initialValue?: string;
  onSubmit: (value: string) => Promise<boolean> | boolean;
  loading?: boolean;
}
