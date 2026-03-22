import { css, keyframes } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

export function LoadingFallback() {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 60px 0;
      `}
    >
      <div
        css={css`
          display: flex;
          gap: 6px;
          align-items: center;
        `}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            css={css`
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${colors.grey400};
              animation: ${pulse} 1.2s ease-in-out infinite;
              animation-delay: ${i * 0.2}s;
            `}
          />
        ))}
      </div>
    </div>
  );
}
