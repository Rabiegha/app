// useLiveData.ts

import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useEvent} from '../../context/EventContext';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';
import { fetchDetailsByType } from '../../services/getDetailsPerTypeService';

const useDetailsPerType = () => {
  const [details, setDetails] = useState({
    totalRegisteredArr: [],
    totalAttendedArr: [],
    totalNotAttendedArr: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = useSelector(selectCurrentUserId);
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
        console.log('response detals per type', response);
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
