import { css } from '@emotion/react';
import { Select, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface TimeSelectFieldProps {
  label: '시작 시간' | '종료 시간';
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function TimeSelectField({ label, value, options, onChange }: TimeSelectFieldProps) {
  return (
    <div css={fieldStyle}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        {label}
      </Text>
      <Select value={value} onChange={e => onChange(e.target.value)} aria-label={label}>
        <option value="">선택</option>
        {options.map(time => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </Select>
    </div>
  );
}

const fieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;
