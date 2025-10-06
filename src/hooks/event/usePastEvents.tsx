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
import {selectCurrentUserId, selectIsLoading} from '../../redux/selectors/auth/authSelectors';

export default function usePastEvents() {
  const expirationTimeInMillis = 24 * 60 * 60 * 1000;
  const events = useSelector(selectPastEvents);
  const loading = useSelector(selectPastEventsLoading);
  const error = useSelector(selectPastEventsError);
  const timeStamp = useSelector(selectPastEventsTimeStamp);
  const userId = useSelector(selectCurrentUserId);
  const isAuthLoading = useSelector(selectIsLoading);
  const {isDemoMode} = useContext(AuthContext) as any;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentTime = Date.now();

    // Don't fetch events if user is not logged in, during logout, or no userId available
    if (!userId && !isDemoMode) {
      console.log('usePastEvents: Skipping API call - no userId and not in demo mode');
      return;
    }
    
    if (isAuthLoading) {
      console.log('usePastEvents: Skipping API call - auth is loading');
      return;
    }

    if (!loading && !error) {
      if (!events || currentTime - (timeStamp || 0) > expirationTimeInMillis) {
        // Only dispatch if we have a valid userId or are in demo mode
        if (userId || isDemoMode) {
          dispatch(fetchPastEvents({userId: userId!, isDemoMode}));
        }
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
    isAuthLoading,
  ]);

  const clearData = useCallback(() => dispatch(clearPastEvents()), [dispatch]);
  
  const refreshEvents = useCallback(() => {
    // Don't refresh events if user is not logged in, during logout, or no userId available
    if (!userId && !isDemoMode) {
      console.log('usePastEvents refreshEvents: Skipping API call - no userId and not in demo mode');
      return Promise.resolve();
    }
    
    if (isAuthLoading) {
      console.log('usePastEvents refreshEvents: Skipping API call - auth is loading');
      return Promise.resolve();
    }
    
    // Only dispatch if we have a valid userId or are in demo mode
    if (userId || isDemoMode) {
      return dispatch(fetchPastEvents({userId: userId!, isDemoMode}));
    }
    return Promise.resolve();
  }, [dispatch, userId, isDemoMode, isAuthLoading]);

  return {events, loading, error, clearData, refreshEvents};
}
