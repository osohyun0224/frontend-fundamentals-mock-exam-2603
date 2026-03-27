import { css, keyframes } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

export function LoadingFallback() {
  return (
    <div css={containerStyle}>
      <div css={dotGroupStyle}>
        {[0, 1, 2].map(i => (
          <div key={i} css={dotStyle(i)} />
        ))}
      </div>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
`;

const dotGroupStyle = css`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const dotStyle = (index: number) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.grey400};
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${index * 0.2}s;
`;
