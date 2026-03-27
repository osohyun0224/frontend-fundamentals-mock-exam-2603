import { useCallback } from 'react';
import { useCancelReservation } from '../api/mutations';
import { FeedbackMessage } from './useReservationStatusState';

interface UseCancelMyReservationParams {
  setMessage: (message: FeedbackMessage | null) => void;
}

interface CancelParams {
  reservationId: string;
  reservationDate: string;
}

export function useCancelMyReservation({ setMessage }: UseCancelMyReservationParams) {
  const cancelMutation = useCancelReservation();

  const handleCancel = useCallback(
    async ({ reservationId, reservationDate }: CancelParams) => {
      try {
        await cancelMutation.mutateAsync({ reservationId, reservationDate });
        setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
      } catch {
        setMessage({ type: 'error', text: '취소에 실패했습니다.' });
      }
    },
    [cancelMutation, setMessage]
  );

  return {
    handleCancel,
    isCancelling: cancelMutation.isLoading,
  };
}
