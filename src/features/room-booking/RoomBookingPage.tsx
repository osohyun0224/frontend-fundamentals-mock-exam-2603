import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Top, Spacing, Border, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatDate } from 'shared/utils';
import { Room } from 'shared/types';
import { useRooms, useReservations } from 'shared/api/queries';
import { useCreateReservation } from './api/queries';
import { filterAvailableRooms } from './utils/filterAvailableRooms';
import { FilterPanel, FilterValues } from './components/FilterPanel';
import { AvailableRoomList } from './components/AvailableRoomList';
import axios from 'axios';

function parseFiltersFromParams(searchParams: URLSearchParams): FilterValues {
  return {
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : [],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };
}

function filtersToSearchParams(filters: FilterValues): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.date) params.date = filters.date;
  if (filters.startTime) params.startTime = filters.startTime;
  if (filters.endTime) params.endTime = filters.endTime;
  if (filters.attendees > 1) params.attendees = String(filters.attendees);
  if (filters.equipment.length > 0) params.equipment = filters.equipment.join(',');
  if (filters.preferredFloor !== null) params.floor = String(filters.preferredFloor);
  return params;
}

function validateFilters(filters: FilterValues): string | null {
  const hasTimeInputs = filters.startTime !== '' && filters.endTime !== '';
  const isEndTimeBeforeStart = hasTimeInputs && filters.endTime <= filters.startTime;
  const isAttendeesInvalid = filters.attendees < 1;

  if (isEndTimeBeforeStart) return '종료 시간은 시작 시간보다 늦어야 합니다.';
  if (isAttendeesInvalid) return '참석 인원은 1명 이상이어야 합니다.';
  return null;
}

function getUniqueFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
}

export function RoomBookingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<FilterValues>(() => parseFiltersFromParams(searchParams));
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;

  useEffect(() => {
    setSearchParams(filtersToSearchParams(filters), { replace: true });
  }, [filters, setSearchParams]);

  const { data: rooms } = useRooms();
  const { data: reservations } = useReservations(date);
  const createMutation = useCreateReservation();

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const validationError = validateFilters(filters);
  const hasTimeInputs = startTime !== '' && endTime !== '';
  const isFilterComplete = hasTimeInputs && !validationError;

  const floors = getUniqueFloors(rooms);

  const availableRooms = isFilterComplete
    ? filterAvailableRooms(rooms, reservations, { attendees, equipment, preferredFloor, startTime, endTime, date })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <div css={css`padding: 12px 24px 0;`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
            color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div css={css`padding: 0 24px;`}>
          <Spacing size={12} />
          <div
            css={css`
              padding: 10px 14px; border-radius: 10px; background: ${colors.red50};
              display: flex; align-items: center; gap: 8px;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>{errorMessage}</Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        floors={floors}
        validationError={validationError}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterComplete && (
        <AvailableRoomList
          rooms={availableRooms}
          selectedRoomId={selectedRoomId}
          isBooking={createMutation.isLoading}
          onSelectRoom={setSelectedRoomId}
          onBook={handleBook}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}
