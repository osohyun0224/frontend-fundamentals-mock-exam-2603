import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }) =>
      createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(queryKeys.reservations(variables.date));
        queryClient.invalidateQueries(queryKeys.myReservations);
      },
    }
  );
}
