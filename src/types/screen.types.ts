import { Attendee } from './attendee.types';

/**
 * Props for connection component
 */
export interface ConnexionComponentProps {
  userName: string;
  password: string;
  setUserName: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: () => void;
}

/**
 * Props for more component (attendee details)
 */
export interface MoreComponentProps {
  firstName: string;
  lastName: string;
  attendeeId: number;
  email?: string;
  phone?: string;
  attendeeStatus: number;
  organization?: string;
  JobTitle?: string;
  commentaire?: string;
  attendeeStatusChangeDatetime?: string;
  See: () => void;
  Print: () => void;
  handleButton?: () => void;
  loading?: boolean;
  modify?: () => void;
  type?: string;
  onFieldUpdateSuccess?: () => void;
}

/**
 * Props for add attendees component
 */
export interface AddAttendeesComponentProps {
  onPress: () => void;
  handleCheckboxPress: () => void;
  setNom: (value: string) => void;
  setPrenom: (value: string) => void;
  setEmail: (value: string) => void;
  setSociete: (value: string) => void;
  setJobTitle: (value: string) => void;
  setSuccess: (value: boolean | null) => void;
  setNumeroTelephone: (value: string) => void;
  nom: string;
  prenom: string;
  email: string;
  societe: string;
  jobTitle: string;
  isChecked: boolean;
  success: boolean | null;
  numeroTelephone: string;
  inputErrors: {
    nom?: boolean;
    prenom?: boolean;
    email?: boolean;
    numeroTelephone?: boolean;
    [key: string]: boolean | undefined;
  };
  resetInputError: (field: string) => void;
  attendeeTypes: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  selectedAttendeeType: number;
  setSelectedAttendeeType: (value: number) => void;
  attendeeColor: string;
}

/**
 * Props for event details component
 */
export interface EventDetailsComponentProps {
  totalAttendees: number;
  checkedInAttendees: number;
  notCheckedInAttendees: number;
  eventName: string;
  eventDate: string;
  eventLocation?: string;
}

/**
 * Props for attendees list screen
 */
export interface AttendeesListScreenProps {
  attendees: Attendee[];
  loading: boolean;
  refreshAttendees: () => void;
  onSearch: (query: string) => void;
  onFilter: () => void;
  onAttendeePress: (attendee: Attendee) => void;
}

/**
 * Props for badge component
 */
export interface BadgeComponentProps {
  attendee: Attendee;
  onDownload: () => void;
  onPrint: () => void;
  loading: boolean;
}
