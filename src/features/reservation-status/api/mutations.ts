import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as remotes from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';

interface CancelReservationParams {
  reservationId: string;
  reservationDate: string;
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reservationId }: CancelReservationParams) => remotes.cancelReservation(reservationId),
    onSuccess: (_data: unknown, variables: CancelReservationParams) => {
      queryClient.invalidateQueries(queryKeys.reservations(variables.reservationDate));
      queryClient.invalidateQueries(queryKeys.myReservations);
    },
  });
}
