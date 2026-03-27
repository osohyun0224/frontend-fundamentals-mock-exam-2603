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

type CreateReservationResult = Awaited<ReturnType<typeof remotes.createReservation>>;

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation<CreateReservationResult, unknown, CreateReservationParams>({
    mutationFn: (data: CreateReservationParams) => remotes.createReservation(data),
    onSuccess: (_data: unknown, variables: CreateReservationParams) => {
      queryClient.invalidateQueries(queryKeys.reservations(variables.date));
      queryClient.invalidateQueries(queryKeys.myReservations);
    },
  });
}
