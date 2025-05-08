import { useState } from 'react';
import { addComment } from '../../services/partner/addCommentService';

export function useAddComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitComment = async ({
    userId,
    attendeeId,
    comment,
  }: {
    userId: string;
    attendeeId: string;
    comment: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      await addComment(userId, attendeeId, comment);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitComment,
    loading,
    error,
    resetError: () => setError(null),
  };
}
