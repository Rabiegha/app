import { useState, useEffect, useCallback } from 'react';
import { registrationSummaryDetails } from '../../services/registrationSummaryDetailsService';

const useRegistrationSummary = (userId, eventId, refreshTrigger) => {
  const [summary, setSummary] = useState({
    totalAttendees: 0,
    totalCheckedIn: 0,
    totalNotCheckedIn: 0,
    capacity: 0,
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchSummary = useCallback(async () => {
    if (!userId || !eventId) return;

    try {
      setLoading(true);
      const response = await registrationSummaryDetails(userId, eventId);

      // ✅ Ensure API response is valid before updating state
      if (response && response.status) {
        const totalRegistered = response.total_registered;
        const totalAttended = response.total_attended;
        const capacity = response.capacity;


        if (!isNaN(totalRegistered) && !isNaN(totalAttended)) {
          setSummary({
            totalAttendees: totalRegistered,
            totalCheckedIn: totalAttended,
            totalNotCheckedIn: totalRegistered - totalAttended,
            capacity: capacity,
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
