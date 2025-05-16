import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import BaseAttendeeListItem from '../../../common/attendee/BaseAttendeeListItem';
import { ListItemProps } from '../../../../types/listItem.types';
import usePrintDocument from '../../../../printing/hooks/usePrintDocument';
import { usePrintStatus } from '../../../../printing/context/PrintStatusContext';
import useFetchAttendeeDetails from '../../../../hooks/attendee/useAttendeeDetails';

const MainAttendeeListItem: React.FC<ListItemProps> = ({ 
  item, 
  searchQuery = '', 
  onUpdateAttendee, 
  onSwipeableOpen 
}) => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const selectedNodePrinter = useSelector((state: any) => state.printers.selectedNodePrinter);
  const { setStatus } = usePrintStatus();
  const { printDocument } = usePrintDocument();
  
  // Fetch attendee details if needed
  const { attendeeDetails } = useFetchAttendeeDetails(refreshTrigger, item.id);

  // Override the print and check-in functionality
  const handlePrintAndCheckIn = async () => {
    try {
      const updatedAttendee = {
        ...item,
        attendee_status: 1,
      };
      await onUpdateAttendee(updatedAttendee);
      setStatus('checkin_success');
      await new Promise(resolve => setTimeout(resolve, 1000));
      printDocument(item.badge_pdf_url, undefined, true);
    } catch (error) {
      console.error('Error while printing and checking in:', error);
    }
  };

  return (
    <BaseAttendeeListItem
      item={item}
      searchQuery={searchQuery}
      onUpdateAttendee={async (attendee) => {
        await onUpdateAttendee(attendee);
        // Add any additional main-specific logic here
      }}
      onSwipeableOpen={onSwipeableOpen}
    />
  );
};

export default React.memo(MainAttendeeListItem);
