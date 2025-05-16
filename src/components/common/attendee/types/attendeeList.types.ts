import { ReactNode, RefObject } from 'react';
import { Attendee } from '../../../../types/attendee.types';

export interface FilterCriteria {
  status: string;
  [key: string]: any;
}

export interface BaseAttendeeListItemProps {
  item: Attendee;
  searchQuery?: string;
  onUpdateAttendee?: (attendee: Attendee) => Promise<void>;
  onSwipeableOpen?: (swipeable: RefObject<any>) => void;
}

export interface BaseAttendeeListProps {
  searchQuery?: string;
  onTriggerRefresh?: () => void;
  filterCriteria?: FilterCriteria;
  refreshing?: boolean;
  attendees?: Attendee[];
  isLoading?: boolean;
  error?: any;
  ListEmptyComponent?: ReactNode;
}

export type ListHandle = {
  handleRefresh: () => void;
};
