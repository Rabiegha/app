import { StyleProp, ViewStyle } from 'react-native';
import { FilterCriteria } from './FiltreComponent.types';

/**
 * Company/Organization data structure
 */
export interface Organization {
  /**
   * Unique identifier for the organization
   */
  id: string;
  
  /**
   * Name of the organization
   */
  name: string;
  
  /**
   * Any additional organization properties
   */
  [key: string]: any;
}

/**
 * Props for the CompaniesFilterComponent
 */
export interface CompaniesFilterComponentProps {
  /**
   * Current filter criteria
   */
  filterCriteria: FilterCriteria;
  
  /**
   * Function to update the filter criteria
   */
  setFilterCriteria: (criteria: FilterCriteria | ((prev: FilterCriteria) => FilterCriteria)) => void;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
