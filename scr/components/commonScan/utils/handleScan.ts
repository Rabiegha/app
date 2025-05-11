import { scanAttendee } from "../../../services/scanAttendeeService";


export const handleScan = async ({
  data,
  userId,
  eventId,
  setScanStatus,
  setAttendeeData,
  setAttendeeName,
  afterSuccess,
  afterFailure,
}) => {
  try {
    const response = await scanAttendee(userId, eventId, data);
    if (response.status === true) {
      const attendee = response.attendee_details;

      setAttendeeData({
        id: attendee?.attendee_id || 'N/A',
        name: attendee?.attendee_name || 'Unknown Attendee',
      });
      setAttendeeName(attendee?.attendee_name || 'Unknown');
      setScanStatus('found');

      await afterSuccess?.(attendee);
    } else {
      setScanStatus('not_found');
      await afterFailure?.();
    }
  } catch (error) {
    console.error('Error during scanning:', error);
    setScanStatus('not_found');
    await afterFailure?.();
  }
};
