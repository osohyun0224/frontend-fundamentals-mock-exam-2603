import { css } from '@emotion/react';
import { useState } from 'react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Room, Reservation } from 'shared/types';
import { HOUR_LABELS } from 'shared/utils/constants';
import { formatEquipmentList } from 'shared/utils/equipment';
import { getTimelineLeftPercent, getTimelineWidthPercent } from '../utils/timeline';

interface TimelineProps {
  rooms: Room[];
  reservations: Reservation[];
}

function ReservationBlock({ room, reservation }: { room: Room; reservation: Reservation }) {
  const [isActive, setIsActive] = useState(false);
  const leftPercent = getTimelineLeftPercent(reservation.start);
  const widthPercent = getTimelineWidthPercent(reservation.start, reservation.end);

  return (
    <div css={reservationBlockWrapperStyle(leftPercent, widthPercent)}>
      <div
        role="button"
        aria-label={`${room.name} ${reservation.start}-${reservation.end} 예약 상세`}
        onClick={() => setIsActive(prev => !prev)}
        css={reservationBlockStyle(isActive)}
      />
      {isActive && (
        <div role="tooltip" css={tooltipStyle}>
          <div>{reservation.start} ~ {reservation.end}</div>
          <div>{reservation.attendees}명</div>
          {reservation.equipment.length > 0 && (
            <div>{formatEquipmentList(reservation.equipment)}</div>
          )}
        </div>
      )}
    </div>
  );
}

function TimelineHeader() {
  return (
    <div css={headerContainerStyle}>
      <div css={roomNameSpacerStyle} />
      <div css={timeLabelsContainerStyle}>
        {HOUR_LABELS.map(hourLabel => {
          const leftPercent = getTimelineLeftPercent(hourLabel);
          return (
            <Text
              key={hourLabel}
              typography="t7"
              fontWeight="regular"
              color={colors.grey400}
              css={timeLabelStyle(leftPercent)}
            >
              {hourLabel.slice(0, 2)}
            </Text>
          );
        })}
      </div>
    </div>
  );
}

export function Timeline({ rooms, reservations }: TimelineProps) {
  return (
    <div css={containerStyle}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 현황
      </Text>
      <Spacing size={16} />

      <div css={timelineContainerStyle}>
        <TimelineHeader />

        {rooms.map((room, index) => {
          const roomReservations = reservations.filter(reservation => reservation.roomId === room.id);
          return (
            <div
              key={room.id}
              css={timelineRowStyle(index)}
            >
              <div css={roomNameCellStyle}>
                <Text typography="t7" fontWeight="medium" color={colors.grey700} ellipsisAfterLines={1}
                  css={roomNameTextStyle}
                >
                  {room.name}
                </Text>
              </div>
              <div css={roomTimelineTrackStyle}>
                {roomReservations.map(reservation => (
                  <ReservationBlock key={reservation.id} room={room} reservation={reservation} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const containerStyle = css`
  padding: 0 24px;
`;

const timelineContainerStyle = css`
  background: ${colors.grey50};
  border-radius: 14px;
  padding: 16px;
`;

const headerContainerStyle = css`
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
`;

const roomNameSpacerStyle = css`
  width: 80px;
  flex-shrink: 0;
  padding-right: 8px;
`;

const timeLabelsContainerStyle = css`
  flex: 1;
  position: relative;
  height: 18px;
`;

const timeLabelStyle = (leftPercent: number) => css`
  position: absolute;
  left: ${leftPercent}%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: -0.3px;
`;

const timelineRowStyle = (index: number) => css`
  display: flex;
  align-items: center;
  height: 32px;
  ${index > 0 ? 'margin-top: 4px;' : ''}
`;

const roomNameCellStyle = css`
  width: 80px;
  flex-shrink: 0;
  padding-right: 8px;
`;

const roomNameTextStyle = css`
  font-size: 12px;
`;

const roomTimelineTrackStyle = css`
  flex: 1;
  height: 24px;
  background: ${colors.white};
  border-radius: 6px;
  position: relative;
  overflow: visible;
`;

const reservationBlockWrapperStyle = (leftPercent: number, widthPercent: number) => css`
  position: absolute;
  left: ${leftPercent}%;
  width: ${widthPercent}%;
  height: 100%;
`;

const reservationBlockStyle = (isActive: boolean) => css`
  width: 100%;
  height: 100%;
  background: ${colors.blue400};
  border-radius: 4px;
  opacity: ${isActive ? 1 : 0.75};
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`;

const tooltipStyle = css`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  background: ${colors.grey900};
  color: ${colors.white};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  line-height: 1.6;
`;
