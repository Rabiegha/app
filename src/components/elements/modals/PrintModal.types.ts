/**
 * Props for the PrintModal component
 */
export interface PrintModalProps {
  /**
   * Function to call when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Whether the modal is visible
   */
  visible: boolean;
  
  /**
   * Current status of the print job
   * Possible values: 'Sending print job', 'printing', 'Print successful', 'Error printing', 'No printer selected'
   */
  status: string | null | undefined;
}
