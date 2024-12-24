import {useSelector, useDispatch} from 'react-redux';
import {
  fetchPastEvents,
  clearPastEvents,
} from '../../redux/slices/event/pastEventsSlice';
import {useContext, useEffect} from 'react';
import {AuthContext} from '../../context/AuthContext';
import useUserId from '../useUserId';
import {
  selectPastEvents,
  selectPastEventsLoading,
  selectPastEventsError,
  selectPastEventsTimeStamp,
} from '../../redux/selectors/event/pastEventsSelectors';

export default function usePastEvents() {
  const expirationTimeInMillis = 24 * 60 * 60 * 1000;
  const events = useSelector(selectPastEvents);
  const loading = useSelector(selectPastEventsLoading);
  const error = useSelector(selectPastEventsError);
  const timeStamp = useSelector(selectPastEventsTimeStamp);
  const isEventFrom = 0;

  const [userId] = useUserId();
  const {isDemoMode} = useContext(AuthContext);

  const dispatch = useDispatch();

  useEffect(() => {
    const currentTime = Date.now();

    if (!loading && !error) {
      if (
        !events ||
        events.length === 0 ||
        currentTime - (timeStamp || 0) > expirationTimeInMillis
      ) {
        dispatch(fetchPastEvents({userId, isEventFrom, isDemoMode}));
      }
    }
  }, [
    dispatch,
    userId,
    isEventFrom,
    events,
    isDemoMode,
    timeStamp,
    loading,
    error,
  ]);

  const clearData = () => {
    dispatch(clearPastEvents());
  };

  return {events, loading, error, fetchPastEvents, clearData};
}
