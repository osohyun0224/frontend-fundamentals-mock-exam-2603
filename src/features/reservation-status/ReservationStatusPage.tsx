import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useRooms, useReservations } from 'shared/api/queries';
import { useMyReservations } from './api/queries';
import { Timeline } from './components/Timeline';
import { MyReservationList } from './components/MyReservationList';
import { DateSelectionSection } from './components/DateSelectionSection';
import { StatusMessageBanner } from './components/StatusMessageBanner';
import { useReservationStatusState } from './hooks/useReservationStatusState';
import { useCancelMyReservation } from './hooks/useCancelMyReservation';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const { date, setDate, message, setMessage } = useReservationStatusState();

  const { data: rooms } = useRooms();
  const { data: reservations } = useReservations(date);
  const { data: myReservationList } = useMyReservations();
  const { handleCancel, isCancelling } = useCancelMyReservation({ setMessage });

  return (
    <div css={pageStyle}>
      <Top.Top03 css={headerStyle}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      <DateSelectionSection date={date} onDateChange={setDate} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <Timeline rooms={rooms} reservations={reservations} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <StatusMessageBanner message={message} />

      <MyReservationList
        reservations={myReservationList}
        rooms={rooms}
        onCancel={handleCancel}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <div css={sectionStyle}>
        <Button display="full" onClick={() => navigate('/booking')} disabled={isCancelling}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}

const pageStyle = css`
  background: ${colors.white};
  padding-bottom: 40px;
`;

const headerStyle = css`
  padding-left: 24px;
  padding-right: 24px;
`;

const sectionStyle = css`
  padding: 0 24px;
`;
