import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useEvent } from '../../context/EventContext';
import { getSessionsList } from '../../services/getSessionsListService';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { Session } from '../../types/session';

/**
 * Hook to extract unique horaires (time slots) from sessions data
 */
export const useSessionHoraires = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { eventId } = useEvent();
  const userId = useSelector(selectCurrentUserId);

  // Fetch sessions data
  useEffect(() => {
    const fetchSessions = async () => {
      if (!userId || !eventId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getSessionsList(userId, eventId);
        setSessions(response.data);
      } catch (err) {
        console.error('Error fetching sessions for horaires:', err);
        setError('Failed to fetch session horaires');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId, eventId]);

  // Extract unique horaires and sort them from most recent to oldest
  const horaires = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return [];
    }

    // First, create a map of time parts to their corresponding Date objects for sorting
    const timeMap = new Map();

    sessions.forEach(session => {
      if (!session.nice_start_datetime) {
        return;
      }
  
      const [datePart, timePart, ampm] = session.nice_start_datetime.split(' ');
      if (!datePart || !timePart) {
        return;
      }
  
      const timeString = timePart + ' ' + (ampm || '');
  
      // Create a standardized date object for comparison (using same date for all, only time matters)
      const [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));
      let hour = hours;
  
      // Convert to 24-hour format for proper comparison
      if (ampm && ampm.toUpperCase() === 'PM' && hours < 12) {
        hour += 12;
      } else if (ampm && ampm.toUpperCase() === 'AM' && hours === 12) {
        hour = 0;
      }
  
      // Store the time string with its corresponding date object
      timeMap.set(timeString, new Date(2025, 0, 1, hour, minutes));
    });

    // Extract unique times and convert to array
    const uniqueTimes = Array.from(timeMap.keys());

    // Sort times by their corresponding date objects (newest to oldest)
    uniqueTimes.sort((a, b) => {
      const dateA = timeMap.get(a);
      const dateB = timeMap.get(b);
      return dateB.getTime() - dateA.getTime(); // Reverse sort (newest first)
    });

    return uniqueTimes;
  }, [sessions]);

  return {
    horaires,
    loading,
    error,
  };
};
