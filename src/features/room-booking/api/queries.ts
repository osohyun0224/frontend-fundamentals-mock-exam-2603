import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as remotes from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';

type CreateReservationParams = {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
};

export const createReservationMutationOptions = (queryClient: ReturnType<typeof useQueryClient>) =>
  ({
    mutationFn: (data: CreateReservationParams) => remotes.createReservation(data),
    onSuccess: (_data: unknown, variables: CreateReservationParams) => {
      queryClient.invalidateQueries(queryKeys.reservations(variables.date));
      queryClient.invalidateQueries(queryKeys.myReservations);
    },
  });

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation(createReservationMutationOptions(queryClient));
}
