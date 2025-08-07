export interface AttendeeData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  organization?: string;
  job_title?: string;
  attendee_type_id?: string;
  badge_url?: string;
  badge_html?: string;
  badge_image_url?: string;
  badge_pdf_url?: string;
}

export interface BadgePreviewParams {
  attendeesData: AttendeeData;
}

export interface ModifyBadgeParams {
  attendeesData: AttendeeData;
}

export type BadgePreviewStackParamList = {
  BadgePreviewScreen: BadgePreviewParams;
  ModifyBadge: ModifyBadgeParams;
};
