// hooks/edit/useUpdateAttendeeField.ts
import { useState } from 'react';
import { updateAttendeeField } from '../../services/updateAttendeeField';


export const useUpdateAttendeeField = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      await updateAttendeeField({ userId, attendeeId, field, value });
      setSuccess(true);
      return true;
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
