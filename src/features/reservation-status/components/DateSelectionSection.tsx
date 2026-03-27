import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatDate } from 'shared/utils';

interface DateSelectionSectionProps {
  date: string;
  onDateChange: (date: string) => void;
}

export function DateSelectionSection({ date, onDateChange }: DateSelectionSectionProps) {
  return (
    <section css={sectionStyle}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        날짜 선택
      </Text>
      <Spacing size={16} />
      <input
        type="date"
        value={date}
        min={formatDate(new Date())}
        onChange={event => onDateChange(event.target.value)}
        aria-label="날짜"
        css={dateInputStyle}
      />
    </section>
  );
}

const sectionStyle = css`
  padding: 0 24px;
`;

const dateInputStyle = css`
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
