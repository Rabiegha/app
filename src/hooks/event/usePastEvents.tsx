import {useCallback, useContext, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {clearPastEvents} from '../../redux/slices/event/pastEventsSlice';
import {fetchPastEvents} from '../../redux/thunks/event/fetchPastEventsThunk';
import {useAppDispatch} from '../../redux/store';
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
  const userId = useSelector(selectCurrentUserId);
  const {isDemoMode} = useContext(AuthContext) as any;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentTime = Date.now();

    if (!loading && !error) {
      if (!events || currentTime - (timeStamp || 0) > expirationTimeInMillis) {
        dispatch(fetchPastEvents({userId, isDemoMode}));
      }
    }
  }, [
    dispatch,
    userId,
    events,
    isDemoMode,
    timeStamp,
    loading,
    error,
    expirationTimeInMillis,
  ]);

  const clearData = useCallback(() => dispatch(clearPastEvents()), [dispatch]);
  
  const refreshEvents = useCallback(() => {
    return dispatch(fetchPastEvents({userId, isDemoMode}));
  }, [dispatch, userId, isDemoMode]);

  return {events, loading, error, clearData, refreshEvents};
}
