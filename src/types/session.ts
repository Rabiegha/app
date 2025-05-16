export interface Session {
  ems_secret_code: string;
  event_id: string;
  event_name: string;
  nice_start_datetime: string;
  nice_end_datetime?: string;
  capacity: number;
  location?: string;
  description?: string;
  event_type_name?: string;
  event_team_members?: string;
  relationship?: number;
  parent_id?: number;
  parent_event_name?: string;
  logo_url?: string;
  // Add other session properties as needed
}

export interface SessionNavigationParams {
  capacity: number;
  eventName: string;
}
