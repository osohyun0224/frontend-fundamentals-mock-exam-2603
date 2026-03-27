import { useMemo } from 'react';

export interface FilterErrors {
  time: string | null;
  attendees: string | null;
}

interface UseFilterErrorsParams {
  startTime: string;
  endTime: string;
  attendees: number;
}

export function useFilterErrors({ startTime, endTime, attendees }: UseFilterErrorsParams): FilterErrors {
  const hasTimeInputs = startTime !== '' && endTime !== '';

  return useMemo(() => {
    const hasInvalidTimeRange = hasTimeInputs && endTime <= startTime;
    const hasInvalidAttendees = attendees < 1;

    return {
      time: hasInvalidTimeRange ? '종료 시간은 시작 시간보다 늦어야 합니다.' : null,
      attendees: hasInvalidAttendees ? '참석 인원은 1명 이상이어야 합니다.' : null,
    };
  }, [attendees, endTime, hasTimeInputs, startTime]);
}
