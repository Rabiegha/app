export type Attendee = {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    attendee_status: number;
    designation?: string;
    organization?: string;
    attendee_type_name?: string;
    attendee_type_id?: number;
    badge_pdf_url?: string;
    badge_image_url?: string;
    attendee_type_background_color?: string;
    event_id?: number;
  };
