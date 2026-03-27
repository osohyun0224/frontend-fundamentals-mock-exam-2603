import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import * as remotes from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';
import { Reservation } from 'shared/types';

export function useRooms() {
  return useSuspenseQuery({
    queryKey: queryKeys.rooms,
    queryFn: () => remotes.getRooms(),
  });
}

export function useReservations(date: string) {
  const query = useQuery({
    queryKey: queryKeys.reservations(date),
    queryFn: () => remotes.getReservations(date),
    enabled: !!date,
  });
  return { ...query, data: query.data ?? ([] as Reservation[]) };
}
