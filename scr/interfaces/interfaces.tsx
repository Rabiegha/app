export interface Attendee {
  id: number;
  event_id: number;
  salutation: string;
  first_name: string;
  last_name: string;
  email: string;
  email_2: string;
  phone: string;
  organization: string;
  comment: string;
  passcode: null;
  attendee_status: number;
}
