// useLiveData.js

import {useState, useEffect} from 'react';
import {registrationSummaryDetails} from '../../services/registrationSummaryDetailsService';
import {useEvent} from '../../context/EventContext';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';

const useRegistrationData = () => {
  const [summary, setSummary] = useState({
    totalAttendees: 0,
    totalCheckedIn: 0,
    totalNotCheckedIn: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = useSelector(selectCurrentUserId);

  const {eventId} = useEvent();

  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await registrationSummaryDetails(userId, eventId);
        if (response.status && isMounted) {
          setSummary({
            totalAttendees: response.total_registered,
            totalCheckedIn: response.total_attended,
            totalNotCheckedIn:
              response.total_registered - response.total_attended,
          });
          setError(null);
        } else {
          throw new Error('Error fetching data');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userId && eventId) {
      fetchSummary();
      // Optionally, set up periodic fetching
      // const intervalId = setInterval(fetchSummary, 5000); // Fetch every 5 seconds

      // return () => {
      //   isMounted = false;
      //   clearInterval(intervalId);
      // };
      return () => {
        isMounted = false;
      };
    }
  }, [userId, eventId]);

  return {summary, loading, error};
};

export default useRegistrationData;
