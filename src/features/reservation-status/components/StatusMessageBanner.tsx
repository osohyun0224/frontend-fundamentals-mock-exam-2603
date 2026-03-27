import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { FeedbackMessage } from '../hooks/useReservationStatusState';

interface StatusMessageBannerProps {
  message: FeedbackMessage | null;
}

export function StatusMessageBanner({ message }: StatusMessageBannerProps) {
  if (!message) {
    return null;
  }

  const isSuccessMessage = message.type === 'success';

  return (
    <div css={containerStyle}>
      <div css={messageBoxStyle(isSuccessMessage)}>
        <Text typography="t7" fontWeight="medium" color={isSuccessMessage ? colors.blue600 : colors.red500}>
          {message.text}
        </Text>
      </div>
      <Spacing size={12} />
    </div>
  );
}

const containerStyle = css`
  padding: 0 24px;
`;

const messageBoxStyle = (isSuccessMessage: boolean) => css`
  padding: 10px 14px;
  border-radius: 10px;
  background: ${isSuccessMessage ? colors.blue50 : colors.red50};
  display: flex;
  align-items: center;
  gap: 8px;
`;
