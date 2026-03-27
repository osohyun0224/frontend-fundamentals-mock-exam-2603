import { css } from '@emotion/react';
import { Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface FloorSelectFieldProps {
  value: number | null;
  floors: number[];
  onChange: (value: number | null) => void;
}

export function FloorSelectField({ value, floors, onChange }: FloorSelectFieldProps) {
  return (
    <div css={containerStyle}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        선호 층
      </Text>
      <Select
        value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
        aria-label="선호 층"
      >
        <option value="">전체</option>
        {floors.map(floor => (
          <option key={floor} value={floor}>
            {floor}층
          </option>
        ))}
      </Select>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;
