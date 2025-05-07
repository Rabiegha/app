import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { selectCurrentUserId } from "../../redux/selectors/auth/authSelectors";
import { useEvent } from '../../context/EventContext';
import { fetchAttendeeCounts } from "../../services/getAttendeeCounts";

// useAttendeeStats.ts
export const useFetchAttendeeCounts = () => {
    const [partnerCount, setPartnerCount] = useState<number>(0);
    const [childSessionCount, setChildSessionCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  
    const userId = useSelector(selectCurrentUserId);
    const { eventId } = useEvent();
  
    const fetchCounts = useCallback(async (attendeeId: string) => {
      if (!userId || !eventId || !attendeeId) return;
  
      setLoading(true);
      setError(null); 
      try {
        const res = await fetchAttendeeCounts(userId, eventId, attendeeId);
        const body = res?.data ?? res;

        setPartnerCount(body?.attendee_partner_details?.count || 0);
        setChildSessionCount(body?.child_attendee_status_details?.count || 0);
      } catch (e) {
        console.error('Erreur lors de fetchCounts:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, [userId, eventId]);
  
    return { partnerCount, childSessionCount, loading, error, fetchCounts };
  };
  