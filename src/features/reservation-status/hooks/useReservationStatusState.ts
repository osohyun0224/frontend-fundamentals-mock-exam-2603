import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDate } from 'shared/utils';

export interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}

interface LocationState {
  message?: string;
}

export function useReservationStatusState() {
  const location = useLocation();
  const [date, setDate] = useState(formatDate(new Date()));
  const locationState = location.state as LocationState | null;

  const initialMessage = useMemo<FeedbackMessage | null>(() => {
    if (!locationState?.message) {
      return null;
    }
    return { type: 'success', text: locationState.message };
  }, [locationState]);

  const [message, setMessage] = useState<FeedbackMessage | null>(initialMessage);

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  return {
    date,
    setDate,
    message,
    setMessage,
  };
}
