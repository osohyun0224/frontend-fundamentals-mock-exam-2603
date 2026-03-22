import { useQuery } from '@tanstack/react-query';
import { getRooms, getReservations } from 'shared/api/remotes';

export function useRooms() {
  return useQuery(['rooms'], getRooms);
}

export function useReservations(date: string) {
  return useQuery(['reservations', date], () => getReservations(date), { enabled: !!date });
}
