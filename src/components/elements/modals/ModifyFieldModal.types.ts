import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the ModifyFieldModal component
 */
export interface ModifyFieldModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Label for the field being modified
   */
  label: string;
  
  /**
   * Initial value of the field
   */
  initialValue: string;
  
  /**
   * Function to call when the user submits the new value
   * Returns a Promise that resolves to a boolean indicating success or failure
   */
  onSubmit: (newValue: string) => Promise<boolean>;
  
  /**
   * Optional custom styles for the modal container
   */
  style?: StyleProp<ViewStyle>;
}
