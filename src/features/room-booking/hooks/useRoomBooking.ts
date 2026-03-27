import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookingParams } from '../utils/searchParams';
import { useCreateReservation } from '../api/queries';

interface UseRoomBookingParams {
  filters: BookingParams;
}

export function useRoomBooking({ filters }: UseRoomBookingParams) {
  const navigate = useNavigate();
  const createMutation = useCreateReservation();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetBookingState = useCallback(() => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  }, []);

  const handleRoomSelect = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setErrorMessage(null);
  }, []);

  const submitBooking = useCallback(async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!filters.startTime || !filters.endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date: filters.date,
        start: filters.startTime,
        end: filters.endTime,
        attendees: filters.attendees,
        equipment: filters.equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errorResult = result as { message?: string };
      setErrorMessage(errorResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (error: unknown) {
      const fallbackMessage = '예약에 실패했습니다.';
      const errorMessageFromServer = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message ?? fallbackMessage
        : fallbackMessage;

      setErrorMessage(errorMessageFromServer);
      setSelectedRoomId(null);
    }
  }, [createMutation, filters, navigate, selectedRoomId]);

  return {
    selectedRoomId,
    errorMessage,
    isBooking: createMutation.isLoading,
    resetBookingState,
    handleRoomSelect,
    submitBooking,
  };
}
