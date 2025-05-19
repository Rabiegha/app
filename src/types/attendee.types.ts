export type Attendee = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  organization?: string;
  designation?: string;
  attendee_status: 0 | 1;
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
  attendeeStatus: 0 | 1;
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
  attendeeStatus?: 0 | 1;
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
