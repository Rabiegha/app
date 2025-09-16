export type Attendee = {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    organization?: string;
    designation?: string;
    attendee_status: number;
    badge_pdf_url?: string;
    badge_image_url?: string;
    attendee_type_name?: string;
    attendee_type_id?: number;
    attendee_type_background_color?: string;
    attendee_status_change_datetime?: string;
    nice_attendee_status_change_datetime?: string;
    event_id?: number;
    partner_count?: number;
    child_session_count?: number;
    comment?: string;
  };
  
  // For frontend display
  export type AttendeeDetails = {
    type: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    organization: string;
    jobTitle: string;
    commentaire: string;
    attendeeStatus: number;
    theAttendeeId: string;
    attendeeStatusChangeDatetime: string;
    urlBadgePdf: string;
    urlBadgeImage: string;
  };
  
  // API Request Types
  export type FetchAttendeesParams = {
    userId: string;
    eventId: string;
    attendeeId?: string;
    attendeeStatus?: number;
  };
  
  // API Response Types
  export type UpdateAttendeeStatusResponse = {
    status: boolean;
    message: string;
  };

  export type UpdateAttendeeStatusParams = {
    userId: string;
    eventId: string;
    attendeeId: string;
    status: 0 | 1;
  };
  
  export type UpdateAttendeeFieldParams = {
    userId: string;
    attendeeId: string;
    field: string;
    value: string;
  };
  
  export type AddAttendeeParams = {
    current_user_login_details_id: string;
    ems_secret_code: string;
    send_confirmation_mail_ems_yn: number;
    generate_qrcode: number;
    generate_badge: number;
    send_badge_yn: number;
    salutation: string;
    send_badge_item: string;
    attendee_type_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    organization: string;
    jobTitle: string;
    status_id: string;
    attendee_status: string;
  };
  
  // Interface for edit attendee parameters
  export interface EditAttendeeParams {
    userId: string;
    attendeeId: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    organization?: string;
    jobTitle?: string;
    typeId?: string;
  }
  
  // State type
  export interface AttendeeState {
    list: Attendee[];
    selectedAttendee: AttendeeDetails | null;
    isLoadingList: boolean;
    isLoadingDetails: boolean;
    isUpdating: boolean;
    error: string | null;
    loadingAttendeeId: string | null;
  }

  export interface AddAttendeeData {
    current_user_login_details_id: string | number;
    ems_secret_code: string;
    attendee_type_id?: string | number;
    salutation?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    organization?: string;
    jobTitle?: string;
    postal_address?: string;
    status_id?: string | number;
    attendee_status?: string | number;
  }

  export interface EditAttendeeData {
    userId: string;
    attendeeId: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    organization?: string;
    jobTitle?: string;
    typeId?: string;
  }