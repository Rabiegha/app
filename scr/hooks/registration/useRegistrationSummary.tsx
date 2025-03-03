import { useState, useEffect, useCallback } from 'react';
import { registrationSummaryDetails } from '../../services/registrationSummaryDetailsService';
import { useEvent } from '../../context/EventContext';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';

const useRegistrationSummary = (refreshTrigger) => {
  const [summary, setSummary] = useState({
    totalAttendees: 0,
    totalCheckedIn: 0,
    totalNotCheckedIn: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = useSelector(selectCurrentUserId);
  const { eventId } = useEvent();

  const fetchSummary = useCallback(async () => {
    if (!userId || !eventId) return;

    try {
      setLoading(true);
      const response = await registrationSummaryDetails(userId, eventId);

      // ✅ Ensure API response is valid before updating state
      if (response && response.status) {
        const totalRegistered = response.total_registered
          ? parseInt(response.total_registered.replace(/,/g, ''), 10)
          : 0;

        const totalAttended = response.total_attended
          ? parseInt(response.total_attended.replace(/,/g, ''), 10)
          : 0;

        if (!isNaN(totalRegistered) && !isNaN(totalAttended)) {
          setSummary({
            totalAttendees: totalRegistered,
            totalCheckedIn: totalAttended,
            totalNotCheckedIn: totalRegistered - totalAttended,
          });

          setError(null);
        } else {
          throw new Error('Invalid API data format');
        }
      } else {
        throw new Error('Error fetching data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, eventId]);

  // Fetch data when eventId changes
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Fetch data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchSummary();
    }
  }, [refreshTrigger]);

  return { summary, loading, error, refetch: fetchSummary };
};

export default useRegistrationSummary;
