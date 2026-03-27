import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import * as remotes from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';
import { Reservation } from 'shared/types';

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.rooms,
    queryFn: () => remotes.getRooms(),
  });

export const reservationsQueryOptions = (date: string) =>
  queryOptions({
    queryKey: queryKeys.reservations(date),
    queryFn: () => remotes.getReservations(date),
    enabled: !!date,
  });

export function useRooms() {
  return useSuspenseQuery(roomsQueryOptions());
}

export function useReservations(date: string) {
  const query = useQuery(reservationsQueryOptions(date));
  return { ...query, data: query.data ?? ([] as Reservation[]) };
}
