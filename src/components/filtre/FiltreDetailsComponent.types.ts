import { StyleProp, ViewStyle } from 'react-native';
import { FilterCriteria } from './FiltreComponent.types';

/**
 * Status option for the filter
 */
export interface StatusOption {
  /**
   * Status value (all, checked-in, not-checked-in)
   */
  status: string;
  
  /**
   * Display label for the status
   */
  label: string;
}

/**
 * Props for the FiltreDetailsComponent
 */
export interface FiltreDetailsComponentProps {
  /**
   * Current filter criteria
   */
  filterCriteria: FilterCriteria;
  
  /**
   * Function to update the filter criteria
   */
  setFilterCriteria: (criteria: FilterCriteria | ((prev: FilterCriteria) => FilterCriteria)) => void;
  
  /**
   * Count of all attendees
   */
  tout: string;
  
  /**
   * Count of checked-in attendees
   */
  checkedIn: string;
  
  /**
   * Count of not checked-in attendees
   */
  notChechkedIn: string;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
