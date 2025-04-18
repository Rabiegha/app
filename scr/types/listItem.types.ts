import { Attendee } from "./attendee.types";

// src/types/listItem.types.ts
export type ListItemProps = {
    item: Attendee;
    searchQuery?: string;
    onUpdateAttendee: (attendee: Attendee) => Promise<void>;
  };
