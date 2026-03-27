import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface AttendeesFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function AttendeesField({ value, onChange }: AttendeesFieldProps) {
  return (
    <div css={fieldStyle}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        참석 인원
      </Text>
      <input
        type="number"
        min={1}
        value={value}
        onChange={e => onChange(Number(e.target.value) || 1)}
        aria-label="참석 인원"
        css={inputStyle}
      />
    </div>
  );
}

const fieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const inputStyle = css`
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${colors.grey200};
  border-radius: 12px;
  background-color: ${colors.grey50};
  color: ${colors.grey800};
  font-size: 16px;
  font-weight: 500;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${colors.blue500};
  }
`;
