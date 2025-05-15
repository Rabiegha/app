import { useEffect, useState } from "react";
import { fetchAttendeesList } from "../../services/getAttendeesListService";

    
    
    const useFetchSessionAttendeeList = (userId: string, eventId: string)  => {
        const [attendees, setAttendees] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(false);

        const fetchData = async () => {
            if (!userId || !eventId) return;
            if (!userId || !eventId) {return;}
            try {
              setError(false);
              setIsLoading(true);
              const response = await fetchAttendeesList(userId, eventId, undefined, 1);
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

    export default useFetchSessionAttendeeList;
