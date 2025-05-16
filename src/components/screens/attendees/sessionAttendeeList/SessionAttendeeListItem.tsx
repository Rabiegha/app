import React from 'react';
import BaseAttendeeListItem from '../../../common/attendee/BaseAttendeeListItem';
import { ListItemProps } from '../../../../types/listItem.types';

const SessionAttendeeListItem: React.FC<ListItemProps> = ({ 
  item, 
  searchQuery = '', 
  onUpdateAttendee 
}) => {
  return (
    <BaseAttendeeListItem
      item={item}
      searchQuery={searchQuery}
      onUpdateAttendee={onUpdateAttendee}
    />
  );
};

export default React.memo(SessionAttendeeListItem);
