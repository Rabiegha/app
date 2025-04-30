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
    event_id?: number;
  };
