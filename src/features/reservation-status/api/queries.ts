import { useSuspenseQuery } from '@tanstack/react-query';
import * as remotes from 'shared/api/remotes';
import { queryKeys } from 'shared/api/queryKeys';

export function useMyReservations() {
  return useSuspenseQuery({
    queryKey: queryKeys.myReservations,
    queryFn: () => remotes.getMyReservations(),
  });
}
