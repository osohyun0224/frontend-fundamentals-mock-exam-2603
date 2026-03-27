import { useMemo } from 'react';
import { BookingParams } from '../utils/searchParams';
import { useFilterErrors } from './useFilterErrors';

interface UseBookingFilterStateParams {
  filters: BookingParams;
}

export function useBookingFilterState({ filters }: UseBookingFilterStateParams) {
  const filterErrors = useFilterErrors({
    startTime: filters.startTime,
    endTime: filters.endTime,
    attendees: filters.attendees,
  });

  const validationError = filterErrors.time ?? filterErrors.attendees;
  const hasTimeInputs = filters.startTime !== '' && filters.endTime !== '';
  const isFilterComplete = useMemo(() => hasTimeInputs && validationError === null, [hasTimeInputs, validationError]);

  return {
    validationError,
    isFilterComplete,
  };
}
