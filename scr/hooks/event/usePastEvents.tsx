import {useSelector, useDispatch} from 'react-redux';
import {
  fetchPastEvents,
  clearPastEvents,
} from '../../redux/slices/event/pastEventsSlice';
import {useContext, useEffect} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {fetchEvents} from '../../redux/slices/eventSlice';
import useUserId from '../useUserId';

export default function usePastEvents() {
  const expirationTimeInMillis = 24 * 60 * 60 * 1000;
  const events = useSelector(state => state.pastEvents.events);
  const loading = useSelector(state => state.pastEvents.loading);
  const error = useSelector(state => state.pastEvents.error);
  const timeStamp = useSelector(state => state.futureEvents.timeStamp);
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

  return {events, loading, error, fetchEvents, clearData};
}
