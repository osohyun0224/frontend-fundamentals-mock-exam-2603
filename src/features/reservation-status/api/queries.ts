import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import * as remotes from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';

export const myReservationsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.myReservations,
    queryFn: () => remotes.getMyReservations(),
  });

export function useMyReservations() {
  return useSuspenseQuery(myReservationsQueryOptions());
}
