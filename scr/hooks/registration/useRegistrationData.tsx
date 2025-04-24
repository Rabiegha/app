// hooks/useRegistrationData.js
import { useState, useEffect, useCallback } from 'react';
import useRegistrationSummary from './useRegistrationSummary';

const useRegistrationData = ({refreshTrigger1}) => {
  const refreshTrigger = refreshTrigger1;

  const { summary, loading, error, refetch } = useRegistrationSummary(refreshTrigger);

  const { totalAttendees = 0, totalCheckedIn = 0, totalNotCheckedIn = 0 } = summary || {};
  const ratio = totalAttendees > 0 ? (totalCheckedIn / totalAttendees) * 100 : 0;

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    totalAttendees,
    totalCheckedIn,
    totalNotCheckedIn,
    ratio,
    loading,
    error,
    summary,
    triggerRefresh,
  };
};

export default useRegistrationData;
