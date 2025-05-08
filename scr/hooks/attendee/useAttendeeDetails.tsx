import { useState, useEffect, useCallback } from 'react';
import { useEvent } from '../../context/EventContext';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import { fetchAttendeesList } from '../../services/getAttendeesListService';

const useFetchAttendeeDetails = (refreshTrigger: number, attendeeId: string) => {
  const [attendeeDetails, setAttendeeDetails] = useState({
    type: '-',
    lastName: '-',
    firstName: '-',
    email: '-',
    phone: '-',
    organization: '-',
    jobTitle: '-',
    commentaire: '-',
    attendeeStatus: '-',
    theAttendeeId: '-',
    attendeeStatusChangeDatetime: '-',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = useSelector(selectCurrentUserId);
  const { eventId } = useActiveEvent();

  const fetchDetails = useCallback(async () => {
    if (!userId || !eventId || !attendeeId) return;

    try {
      setLoading(true);
      const attendees = await fetchAttendeesList(userId, eventId, attendeeId);

      if (Array.isArray(attendees) && attendees.length > 0) {
        const attendee = attendees[0];

        if (attendee) {
          setAttendeeDetails({
            type: attendee.attendee_type_name || '-',
            lastName: attendee.last_name || '-',
            firstName: attendee.first_name || '-',
            email: attendee.email || '-',
            phone: attendee.phone || '-',
            organization: attendee.organization || '-',
            jobTitle: attendee.designation || '-',
            theAttendeeId: attendee.attendee_id || '-',
            commentaire: attendee.comment || '-',
            attendeeStatusChangeDatetime: attendee.nice_attendee_status_change_datetime || '-',
            attendeeStatus: attendee.attendee_status|| '-',
          });
          setError(null);
        } else {
          throw new Error('Aucun participant trouvé');
        }
      } else {
        throw new Error('Erreur de réponse API');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [userId, eventId, attendeeId]);

  useEffect(() => {
    fetchDetails();
    console.log('Params attendeeId:', attendeeId, eventId);
    console.log('Fetched details:', attendeeDetails);

  }, [fetchDetails]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchDetails();
    }
  }, [refreshTrigger, fetchDetails]);

  return { attendeeDetails, loading, error, refetch: fetchDetails };
};

export default useFetchAttendeeDetails;
