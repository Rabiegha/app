import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useEvent } from '../../context/EventContext';
import { getSessionsList } from '../../services/getSessionsListService';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { Session } from '../../types/session';

/**
 * Hook to extract unique locations from sessions data
 */
export const useSessionLocations = () => {
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
        console.error('Error fetching sessions for locations:', err);
        setError('Failed to fetch session locations');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId, eventId]);

  // Extract unique locations
  const locations = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Get unique locations
    const uniqueLocations = Array.from(
      new Set(sessions.map(session => session.location).filter(Boolean))
    );

    return uniqueLocations;
  }, [sessions]);

  // Extract unique dates
  const dates = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Extract dates from nice_start_datetime (format: "29/04/2025 12:00 AM")
    const uniqueDates = Array.from(
      new Set(
        sessions
          .map(session => {
            const datePart = session.nice_start_datetime?.split(' ')[0];
            return datePart;
          })
          .filter(Boolean)
      )
    );

    return uniqueDates;
  }, [sessions]);

  return {
    locations,
    dates,
    loading,
    error,
  };
};
