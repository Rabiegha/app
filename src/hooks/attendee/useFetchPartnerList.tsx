import { useEffect, useState } from "react";
import { fetchPartnerAttendeesList } from "../../services/partner/getPartnerAttendeeListService";
import { Attendee } from "../../types/attendee.types";

    
    
    interface UseFetchPartnerAttendeeListResult {
    attendees: Attendee[];
    isLoading: boolean;
    error: boolean;
    fetchData: () => Promise<void>;
}

const useFetchPartnerAttendeeList = (userId: string, eventId: string): UseFetchPartnerAttendeeListResult => {
        const [attendees, setAttendees] = useState<Attendee[]>([]);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(false);

        const fetchData = async () => {
            if (!userId || !eventId) return;
            if (!userId || !eventId) {return;}
            try {
              setError(false);
              setIsLoading(true);
              const response = await fetchPartnerAttendeesList(userId, eventId);
              console.log('Partner attendees response:', response);
              setAttendees(response || []);
            } catch (err) {
              console.error('Error fetching session attendees', err);
              setError(true);
            } finally {
              setIsLoading(false);
            }
        }
        useEffect (()=>{
            fetchData();
        }, [userId, eventId])

        return { attendees, isLoading, error, fetchData };
    };

    export default useFetchPartnerAttendeeList;
