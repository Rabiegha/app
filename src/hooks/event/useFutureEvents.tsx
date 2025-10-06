// useEventsData.ts
import {useEffect, useContext, useCallback, useMemo} from 'react';

import {useSelector} from 'react-redux';
import {AuthContext} from '../../context/AuthContext';
import {fetchFutureEvents} from '../../redux/thunks/event/fetchFutureEventsThunk';
import {clearFutureEvents} from '../../redux/slices/event/futureEventsSlice';
import {
  selectFutureEvents,
  selectFutureEventsLoading,
  selectFutureEventsError,
  selectFutureEventsTimeStamp,
} from '../../redux/selectors/event/futureEventsSelectors';
import {selectCurrentUserId, selectIsLoading} from '../../redux/selectors/auth/authSelectors';
import {useAppDispatch} from '../../redux/store';

export default function useFutureEvents() {
  const expirationTimeInMillis = 24 * 60 * 60 * 1000;

  const events = useSelector(selectFutureEvents);
  const loading = useSelector(selectFutureEventsLoading);
  const error = useSelector(selectFutureEventsError);
  const timeStamp = useSelector(selectFutureEventsTimeStamp);
  const userId = useSelector(selectCurrentUserId);
  const isAuthLoading = useSelector(selectIsLoading);

  const isEventFromList = useMemo(() => [1, 2], []);

  const {isDemoMode} = useContext(AuthContext) as any;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentTime = Date.now();

    // Don't fetch events if user is not logged in, during logout, or no userId available
    if (!userId && !isDemoMode) {
      console.log('useFutureEvents: Skipping API call - no userId and not in demo mode');
      return;
    }
    
    if (isAuthLoading) {
      console.log('useFutureEvents: Skipping API call - auth is loading');
      return;
    }
    if (!loading && !error) {
      if (!events || currentTime - (timeStamp || 0) > expirationTimeInMillis) {
        // Only dispatch if we have a valid userId or are in demo mode
        if (userId || isDemoMode) {
          dispatch(fetchFutureEvents({userId: userId!, isEventFromList, isDemoMode}));
        }
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
    expirationTimeInMillis,
    isAuthLoading,
  ]);

  const clearData = useCallback(
    () => dispatch(clearFutureEvents()),
    [dispatch],
  );
  
  const refreshEvents = useCallback(() => {
    // Don't refresh events if user is not logged in, during logout, or no userId available
    if (!userId && !isDemoMode) {
      console.log('useFutureEvents refreshEvents: Skipping API call - no userId and not in demo mode');
      return Promise.resolve();
    }
    
    if (isAuthLoading) {
      console.log('useFutureEvents refreshEvents: Skipping API call - auth is loading');
      return Promise.resolve();
    }
    
    // Only dispatch if we have a valid userId or are in demo mode
    if (userId || isDemoMode) {
      return dispatch(fetchFutureEvents({userId: userId!, isEventFromList, isDemoMode}));
    }
    return Promise.resolve();
  }, [dispatch, userId, isEventFromList, isDemoMode, isAuthLoading]);

  return {events, loading, error, clearData, refreshEvents};
}
