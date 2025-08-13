// hooks/edit/useUpdateAttendeeField.ts
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAttendeeFieldThunk } from '../../features/attendee';
import { AppDispatch } from '../../redux/store';


export const useUpdateAttendeeField = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const submitFieldUpdate = async ({
    userId,
    attendeeId,
    field,
    value,
  }: {
    userId: string;
    attendeeId: string;
    field: string;
    value: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Use the Redux thunk instead of calling the service directly
      const result = await dispatch(updateAttendeeFieldThunk({
        userId,
        attendeeId,
        field,
        value
      }));
      
      // Check if the action was fulfilled or rejected
      if (updateAttendeeFieldThunk.fulfilled.match(result)) {
        setSuccess(true);
        return true;
      } else {
        // Handle rejection
        setError(result.payload as string || 'Update failed');
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { submitFieldUpdate, loading, error, success, reset };
};
