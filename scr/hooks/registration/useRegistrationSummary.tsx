// useLiveData.js

import {useState, useEffect} from 'react';
import {registrationSummaryDetails} from '../../services/registrationSummaryDetailsService';
import {useEvent} from '../../context/EventContext';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';

const useRegistrationSummary = () => {
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
        const parseNumber = num => parseInt(num.replace(/,/g, ''), 10);
        if (response.status && isMounted) {
          setSummary({
            totalAttendees: response.total_registered,
            totalCheckedIn: response.total_attended,
            totalNotCheckedIn:
              response.total_registered - response.total_attended,
          });
          console.log('totalAttendees', response.total_registered);
          console.log('totalAttendees', summary.totalAttendees);
          console.log('totalCheckedIn', response.total_attended);
          console.log('totalCheckedIn', summary.totalCheckedIn);
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
      return () => {
        isMounted = false;
      };
    }
  }, [userId, eventId]);

  return {summary, loading, error};
};

export default useRegistrationSummary;
