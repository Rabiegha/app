// useEventsData.js
import {useEffect, useContext, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectEvents,
  selectLoading,
  selectError,
  selectTimeStamp,
} from '../../redux/selectors/eventSelectors';
import useUserId from '../useUserId';
import {AuthContext} from '../../context/AuthContext';
import {fetchFutureEvents, clearFutureEvents} from '../../redux/slices/event/futureEventsSlice';

export default function useEventsData(isEventFromList) {
  const expirationTimeInMillis = 24 * 60 * 60 * 1000;
  const events = useSelector(selectEvents);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const timeStamp = useSelector(selectTimeStamp);

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
