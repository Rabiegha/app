import {useSelector, useDispatch} from 'react-redux';
import {clearPastEvents} from '../../redux/slices/event/pastEventsSlice';
import {fetchPastEvents} from '../../redux/thunks/event/fetchPastEventsThunk';
import {useCallback, useContext, useEffect} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {
  selectPastEvents,
  selectPastEventsLoading,
  selectPastEventsError,
  selectPastEventsTimeStamp,
} from '../../redux/selectors/event/pastEventsSelectors';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';

export default function usePastEvents() {
  const expirationTimeInMillis = 24 * 60 * 60 * 1000;
  const events = useSelector(selectPastEvents);
  const loading = useSelector(selectPastEventsLoading);
  const error = useSelector(selectPastEventsError);
  const timeStamp = useSelector(selectPastEventsTimeStamp);
  const isEventFrom = 0;

  const userId = useSelector(selectCurrentUserId);
  const {isDemoMode} = useContext(AuthContext);

  const dispatch = useDispatch();

  useEffect(() => {
    const currentTime = Date.now();

    if (!loading && !error) {
      if (!events || currentTime - (timeStamp || 0) > expirationTimeInMillis) {
        dispatch(fetchPastEvents({userId, isEventFrom, isDemoMode}));
      }
    }
  }, [
    dispatch,
    fetchPastEvents,
    userId,
    isEventFrom,
    events,
    isDemoMode,
    timeStamp,
    loading,
    error,
  ]);

  const clearData = useCallback(() => dispatch(clearPastEvents()), [dispatch]);
  
  const refreshEvents = useCallback(() => {
    return dispatch(fetchPastEvents({userId, isEventFrom, isDemoMode}));
  }, [dispatch, userId, isEventFrom, isDemoMode]);

  return {events, loading, error, clearData, refreshEvents};
}
