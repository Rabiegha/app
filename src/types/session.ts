export interface Session {
  ems_secret_code: string;
  event_id: string;
  event_name: string;
  nice_start_datetime: string;
  capacity: number;
  // Add other session properties as needed
}

export interface SessionNavigationParams {
  capacity: number;
  eventName: string;
}
