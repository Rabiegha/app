// hooks/useRegistrationData.ts
import { useState, useEffect, useCallback } from 'react';
import useRegistrationSummary from './useRegistrationSummary';
import { useSelector } from 'react-redux';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useEvent } from '../../context/EventContext';

const useRegistrationData = ({refreshTrigger1}) => {
  const refreshTrigger = refreshTrigger1;
  const userId = useSelector(selectCurrentUserId);
  const {eventId} = useEvent();

  const { summary, loading, error, refetch } = useRegistrationSummary(userId, eventId, refreshTrigger);

  const { totalAttendees = 0, totalCheckedIn = 0, totalNotCheckedIn = 0, capacity = 0 } = summary || {};
  const ratio = totalAttendees > 0 ? (totalCheckedIn / totalAttendees) * 100 : 0;

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    totalAttendees,
    totalCheckedIn,
    totalNotCheckedIn,
    capacity,
    ratio,
    loading,
    error,
    summary,
    triggerRefresh,
  };
};

export default useRegistrationData;
