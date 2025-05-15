import { AttendeeData } from '../../components/screens/MoreComponent.types';

/**
 * Type for field configuration in attendeeFieldConfig
 */
export interface FieldConfigItem {
  /**
   * Display label for the field
   */
  label: string;
  
  /**
   * Field name used for API calls
   */
  fieldName: string;
  
  /**
   * Function to access the field value from attendee data
   */
  accessor: (data: AttendeeData) => string;
}

/**
 * Type for the attendeeFieldConfig object
 */
export interface AttendeeFieldConfig {
  [key: string]: FieldConfigItem;
  comment: FieldConfigItem;
  email: FieldConfigItem;
  organization: FieldConfigItem;
  jobTitle: FieldConfigItem;
  phone: FieldConfigItem;
}
