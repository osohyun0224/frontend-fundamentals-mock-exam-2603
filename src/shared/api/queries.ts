import { useQuery } from '@tanstack/react-query';
import { getRooms, getReservations } from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';
import { Room, Reservation } from 'shared/types';

export function useRooms() {
  const query = useQuery(queryKeys.rooms, getRooms, { suspense: true });
  return { ...query, data: query.data ?? ([] as Room[]) };
}

export function useReservations(date: string) {
  const query = useQuery(queryKeys.reservations(date), () => getReservations(date), {
    suspense: true,
    enabled: !!date,
  });
  return { ...query, data: query.data ?? ([] as Reservation[]) };
}
