// Re-export everything consumers should use.
export { default as attendeeReducer } from './attendee.slice';
export * from './attendee.slice';     // actions (clearAttendees, etc.)
export * from './attendee.thunks';    // thunks (fetchAttendeeDetails, etc.)
export * from './attendee.types';     // types (optional to expose)