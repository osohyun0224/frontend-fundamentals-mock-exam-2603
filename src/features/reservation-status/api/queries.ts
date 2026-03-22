import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyReservations, cancelReservation } from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';
import { Reservation } from 'shared/types';

export function useMyReservations() {
  const query = useQuery(queryKeys.myReservations, getMyReservations, { suspense: true });
  return { ...query, data: query.data ?? ([] as Reservation[]) };
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.allReservations);
      queryClient.invalidateQueries(queryKeys.myReservations);
    },
  });
}
