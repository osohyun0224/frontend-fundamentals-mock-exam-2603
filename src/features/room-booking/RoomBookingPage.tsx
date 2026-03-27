import { css } from '@emotion/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatDate } from 'shared/utils';
import { TIME_SLOTS } from 'shared/utils/constants';
import { Room } from 'shared/types';
import { useRooms, useReservations } from 'shared/api/queries';
import { filterAvailableRooms } from './utils/filterAvailableRooms';
import { AvailableRoomList } from './components/AvailableRoomList';
import { DateField } from './components/DateField';
import { TimeSelectField } from './components/TimeSelectField';
import { AttendeesField } from './components/AttendeesField';
import { FloorSelectField } from './components/FloorSelectField';
import { EquipmentSelector } from './components/EquipmentSelector';
import { useBookingSearchParams } from './hooks/useBookingSearchParams';
import { useBookingFilterState } from './hooks/useBookingFilterState';
import { useRoomBooking } from './hooks/useRoomBooking';

function getUniqueFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);
}

export function RoomBookingPage() {
  const navigate = useNavigate();
  const { filters, updateFilter } = useBookingSearchParams();

  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;

  const { data: rooms } = useRooms();
  const { data: reservations } = useReservations(date);
  const { validationError, isFilterComplete } = useBookingFilterState({ filters });
  const { selectedRoomId, errorMessage, isBooking, resetBookingState, handleRoomSelect, submitBooking } = useRoomBooking({ filters });

  const floors = useMemo(() => getUniqueFloors(rooms), [rooms]);

  const availableRooms = useMemo(
    () =>
      isFilterComplete
        ? filterAvailableRooms(rooms, reservations, { attendees, equipment, preferredFloor, startTime, endTime, date })
        : [],
    [attendees, date, endTime, equipment, isFilterComplete, preferredFloor, reservations, rooms, startTime]
  );

  return (
    <div css={pageStyle}>
      <div css={backButtonContainerStyle}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={backButtonStyle}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={headerStyle}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div css={errorContainerStyle}>
          <Spacing size={12} />
          <div css={errorBoxStyle}>
            <Text typography="t7" fontWeight="medium" color={colors.red500}>{errorMessage}</Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      <section css={sectionStyle}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />

        <DateField
          value={filters.date}
          min={formatDate(new Date())}
          onChange={dateValue => {
            updateFilter('date', dateValue);
            resetBookingState();
          }}
        />
        <Spacing size={14} />

        <div css={rowStyle}>
          <TimeSelectField
            label="시작 시간"
            value={filters.startTime}
            options={TIME_SLOTS.slice(0, -1)}
            onChange={startValue => {
              updateFilter('startTime', startValue);
              resetBookingState();
            }}
          />
          <TimeSelectField
            label="종료 시간"
            value={filters.endTime}
            options={TIME_SLOTS.slice(1)}
            onChange={endValue => {
              updateFilter('endTime', endValue);
              resetBookingState();
            }}
          />
        </div>
        <Spacing size={14} />

        <div css={rowStyle}>
          <AttendeesField
            value={filters.attendees}
            onChange={attendeesValue => {
              updateFilter('attendees', attendeesValue);
              resetBookingState();
            }}
          />
          <FloorSelectField
            value={filters.preferredFloor}
            floors={floors}
            onChange={preferredFloorValue => {
              updateFilter('preferredFloor', preferredFloorValue);
              resetBookingState();
            }}
          />
        </div>
        <Spacing size={14} />

        <EquipmentSelector
          value={filters.equipment}
          onChange={equipmentValue => {
            updateFilter('equipment', equipmentValue);
            resetBookingState();
          }}
        />

        {validationError && (
          <>
            <Spacing size={8} />
            <Text typography="t7" color={colors.red500} role="alert">
              {validationError}
            </Text>
          </>
        )}
      </section>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterComplete && (
        <AvailableRoomList
          rooms={availableRooms}
          selectedRoomId={selectedRoomId}
          isBooking={isBooking}
          onSelectRoom={handleRoomSelect}
          onBook={submitBooking}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}

const sectionStyle = css`
  padding: 0 24px;
`;

const rowStyle = css`
  display: flex;
  gap: 12px;
`;

const pageStyle = css`
  background: ${colors.white};
  padding-bottom: 40px;
`;

const backButtonContainerStyle = css`
  padding: 12px 24px 0;
`;

const backButtonStyle = css`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  color: ${colors.grey600};

  &:hover {
    color: ${colors.grey900};
  }
`;

const headerStyle = css`
  padding-left: 24px;
  padding-right: 24px;
`;

const errorContainerStyle = css`
  padding: 0 24px;
`;

const errorBoxStyle = css`
  padding: 10px 14px;
  border-radius: 10px;
  background: ${colors.red50};
  display: flex;
  align-items: center;
  gap: 8px;
`;
