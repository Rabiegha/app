/**
 * Event related type definitions
 */

/**
 * Represents an event in the application
 */
export interface Event {
  event_id: number;
  ems_secret_code: string;
  event_name: string;
  nice_start_datetime: string;
  nice_end_datetime: string;
  event_type_name: string;
  description: string;
  event_team_members: string;
  relationship: number;
  parent_id: number;
  parent_event_name: string;
  child_event_ids: string;
  child_event_names: string;
  // Add any other properties that might be used in your application
}

/**
 * Response structure for event list API
 */
export interface EventsResponse {
  status: boolean;
  event_details: Event[];
}

/**
 * Event type with optional properties for partial data
 */
export type PartialEvent = Partial<Event>;

/**
 * Event filter parameters
 */
export interface EventFilterParams {
  searchQuery?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
}
