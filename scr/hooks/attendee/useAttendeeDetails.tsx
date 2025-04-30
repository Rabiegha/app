import { useState, useEffect, useCallback } from 'react';
import { useEvent } from '../../context/EventContext';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import { fetchAttendeesList } from '../../services/getAttendeesListService';

const useFetchAttendeeDetails = (refreshTrigger: number, attendeeId: string) => {
  const [attendeeDetails, setAttendeeDetails] = useState({
    Type: '-',
    Nom: '-',
    Prenom: '-',
    Mail: '-',
    Telephone: '-',
    Entreprise: '-',
    JobTitle: '-',
    attendeeStatusChangeDatetime: '',
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
            Type: attendee.attendee_type_name || '-',
            Nom: attendee.last_name || '-',
            Prenom: attendee.first_name || '-',
            Mail: attendee.email || '-',
            Telephone: attendee.phone || '-',
            Entreprise: attendee.organization || '-',
            JobTitle: attendee.designation || '-',
            attendeeStatusChangeDatetime: attendee.nice_attendee_status_change_datetime || '-',
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
