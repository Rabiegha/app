// useEventsData.js
import {useEffect, useContext, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useUserId from '../useUserId';
import {AuthContext} from '../../context/AuthContext';
import {fetchFutureEvents} from '../../redux/thunks/event/fetchFutureEventsThunk';
import {clearFutureEvents} from '../../redux/slices/event/futureEventsSlice';
import {
  selectFutureEvents,
  selectFutureEventsLoading,
  selectFutureEventsError,
  selectFutureEventsTimeStamp,
} from '../../redux/selectors/event/futureEventsSelectors';

export default function useFutureEvents() {
  const expirationTimeInMillis = 24 * 60 * 60 * 1000;

  const events = useSelector(selectFutureEvents);
  const loading = useSelector(selectFutureEventsLoading);
  const error = useSelector(selectFutureEventsError);
  const timeStamp = useSelector(selectFutureEventsTimeStamp);
  const isEventFromList = [1, 2];

  const userId = useUserId();
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
        dispatch(fetchFutureEvents({userId, isEventFromList, isDemoMode}));
      }
    }
  }, [
    dispatch,
    userId,
    isEventFromList,
    events,
    isDemoMode,
    timeStamp,
    loading,
    error,
  ]);

  const clearData = useCallback(
    () => dispatch(clearFutureEvents()),
    [dispatch],
  );

  return {events, loading, error, clearData};
}