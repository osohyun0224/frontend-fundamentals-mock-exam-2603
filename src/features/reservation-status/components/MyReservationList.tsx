import { css } from '@emotion/react';
import { Spacing, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Room, Reservation } from 'shared/types';
import { formatEquipmentListOrFallback } from 'shared/utils/equipment';

interface MyReservationListProps {
  reservations: Reservation[];
  rooms: Room[];
  onCancel: (params: { reservationId: string; reservationDate: string }) => void;
}

export function MyReservationList({ reservations, rooms, onCancel }: MyReservationListProps) {
  const getRoomName = (roomId: string) => rooms.find(room => room.id === roomId)?.name ?? roomId;

  return (
    <div css={containerStyle}>
      <div css={headerRowStyle}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        {reservations.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {reservations.length}건
          </Text>
        )}
      </div>
      <Spacing size={16} />

      {reservations.length === 0 ? (
        <div css={emptyStateStyle}>
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div css={listStyle}>
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              css={reservationCardStyle}
            >
              <ListRow
                contents={
                  <ListRow.Text2Rows
                    top={getRoomName(reservation.roomId)}
                    topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                    bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${formatEquipmentListOrFallback(reservation.equipment, '장비 없음')}`}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={
                  <Button
                    type="danger"
                    style="weak"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('정말 취소하시겠습니까?')) {
                        onCancel({ reservationId: reservation.id, reservationDate: reservation.date });
                      }
                    }}
                  >
                    취소
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle = css`
  padding: 0 24px;
`;

const headerRowStyle = css`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const emptyStateStyle = css`
  padding: 40px 0;
  text-align: center;
  background: ${colors.grey50};
  border-radius: 14px;
`;

const listStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const reservationCardStyle = css`
  padding: 14px 16px;
  border-radius: 14px;
  background: ${colors.grey50};
  border: 1px solid ${colors.grey200};
`;
