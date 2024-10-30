// useLiveData.js

import {useState, useEffect} from 'react';
import {fetchDetailsByType} from '../services/serviceApi';
import useUserId from './useUserId';
import {useEvent} from '../context/EventContext';

const useDetailsPerType = () => {
  const [details, setDetails] = useState({
    totalRegisteredArr: [],
    totalAttendedArr: [],
    totalNotAttendedArr: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userId] = useUserId();
  const {eventId} = useEvent();

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchDetailsByType(userId, eventId);
        if (response.status && isMounted) {
          setDetails({
            totalRegisteredArr: response.total_registered_arr,
            totalAttendedArr: response.total_attended_arr,
            totalNotAttendedArr: response.total_not_attended_arr,
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
      fetchDetails();
      return () => {
        isMounted = false;
      };
    }
  }, [userId, eventId]);

  return {details, loading, error};
};

export default useDetailsPerType;
