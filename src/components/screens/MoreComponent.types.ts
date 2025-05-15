/**
 * Props for the MoreComponent
 */
export interface MoreComponentProps {
  /**
   * First name of the attendee
   */
  firstName: string;
  
  /**
   * Last name of the attendee
   */
  lastName: string;
  
  /**
   * ID of the attendee
   */
  attendeeId: number;
  
  /**
   * Email of the attendee
   */
  email?: string;
  
  /**
   * Phone number of the attendee
   */
  phone?: string;
  
  /**
   * Status of the attendee (0 = not checked in, 1 = checked in)
   */
  attendeeStatus: number;
  
  /**
   * Organization/company of the attendee
   */
  organization?: string;
  
  /**
   * Job title of the attendee
   */
  JobTitle?: string;
  
  /**
   * Comment about the attendee
   */
  commentaire?: string;
  
  /**
   * Timestamp of when the attendee's status was last changed
   */
  attendeeStatusChangeDatetime?: string;
  
  /**
   * Function to call when the See button is pressed
   */
  See: () => void;
  
  /**
   * Function to call when the Print button is pressed
   */
  Print: () => void;
  
  /**
   * Function to call when the main button is pressed
   */
  handleButton?: () => void;
  
  /**
   * Whether the component is in a loading state
   */
  loading?: boolean;
  
  /**
   * Function to call when the modify button is pressed
   */
  modify?: () => void;
  
  /**
   * Type of the attendee
   */
  type?: string;
  
  /**
   * Function to call when a field is successfully updated
   */
  onFieldUpdateSuccess?: () => void;
}

/**
 * Type for attendee data used in the component
 */
export interface AttendeeData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  comment?: string;
  typeId?: number;
}

/**
 * Type for field configuration
 */
export interface FieldConfig {
  fieldName: string;
  label: string;
  accessor: (data: AttendeeData) => string;
}

/**
 * Type for field update parameters
 */
export interface FieldUpdateParams {
  userId: string | number;
  attendeeId: number;
  field: string;
  value: string;
}

/**
 * Type for base fields in the component
 */
export interface BaseField {
  label: string;
  value: string;
  fieldKey?: string;
  hideForPartner?: boolean;
  showForPartnerOnly?: boolean;
  showButton?: boolean;
}
