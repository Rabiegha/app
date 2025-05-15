import { StyleProp, ViewStyle } from 'react-native';

/**
 * Filter criteria for attendees
 */
export interface FilterCriteria {
  /**
   * Filter by status (checked in, not checked in, all)
   */
  status?: string;
  
  /**
   * Filter by attendee type
   */
  type?: string;
  
  /**
   * Filter by company
   */
  company?: string;
  
  /**
   * Any other filter criteria
   */
  [key: string]: any;
}

/**
 * Props for the FiltreComponent
 */
export interface FiltreComponentProps {
  /**
   * Initial filter criteria
   */
  initialFilter: FilterCriteria;
  
  /**
   * Default filter criteria to reset to
   */
  defaultFilter?: FilterCriteria;
  
  /**
   * Function to call when the apply button is pressed
   */
  onApply: (filterCriteria: FilterCriteria) => void;
  
  /**
   * Function to call when the cancel button is pressed
   */
  onCancel: () => void;
  
  /**
   * Label for the "All" filter option
   */
  tout: string;
  
  /**
   * Label for the "Checked In" filter option
   */
  checkedIn: string;
  
  /**
   * Label for the "Not Checked In" filter option
   */
  notChechkedIn: string;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
