import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookingParams, parseBookingSearchParams, toBookingSearchParams } from '../utils/searchParams';

export function useBookingSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseBookingSearchParams(searchParams), [searchParams]);

  const setFilters = useCallback(
    (nextFilters: BookingParams) => {
      setSearchParams(toBookingSearchParams(nextFilters), { replace: true });
    },
    [setSearchParams]
  );

  const updateFilter = useCallback(
    <K extends keyof BookingParams>(key: K, value: BookingParams[K]) => {
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters]
  );

  return {
    filters,
    setFilters,
    updateFilter,
  };
}
