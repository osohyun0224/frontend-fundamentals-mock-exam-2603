import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface DateFieldProps {
  value: string;
  min: string;
  onChange: (value: string) => void;
}

export function DateField({ value, min, onChange }: DateFieldProps) {
  return (
    <div css={fieldStyle}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        날짜
      </Text>
      <input
        type="date"
        value={value}
        min={min}
        onChange={event => onChange(event.target.value)}
        aria-label="날짜"
        css={inputStyle}
      />
    </div>
  );
}

const fieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
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
