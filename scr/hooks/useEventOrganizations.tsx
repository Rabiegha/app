import { useState, useEffect, useCallback } from 'react';
import { fetchEventOrganizations } from '../services/eventOrganizationsService';

export default function useEventOrganizations(userId, eventId) {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrganizations = useCallback(async () => {
    if (!userId || !eventId) {
      setOrganizations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await fetchEventOrganizations(userId, eventId);

      // If your server returns an array directly, this is fine:
      // setOrganizations(data || []);

      // If your server returns an object like { organizations: [...] },
      // do:
      // setOrganizations(data.organizations ?? []);

      setOrganizations(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, eventId]);

  useEffect(() => {
    getOrganizations();
  }, [getOrganizations]);

  return {
    organizations,
    loading,
    error,
    refetch: getOrganizations,
  };
}
