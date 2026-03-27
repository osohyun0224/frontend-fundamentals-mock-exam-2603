import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS } from 'shared/utils/constants';

interface EquipmentSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function EquipmentSelector({ value, onChange }: EquipmentSelectorProps) {
  return (
    <div>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        필요 장비
      </Text>
      <Spacing size={8} />
      <div css={buttonContainerStyle}>
        {ALL_EQUIPMENT.map(equipment => {
          const isSelected = value.includes(equipment);

          return (
            <button
              key={equipment}
              type="button"
              onClick={() => {
                const nextValue = isSelected ? value.filter(item => item !== equipment) : [...value, equipment];
                onChange(nextValue);
              }}
              aria-label={EQUIPMENT_LABELS[equipment]}
              aria-pressed={isSelected}
              css={buttonStyle(isSelected)}
            >
              {EQUIPMENT_LABELS[equipment]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const buttonContainerStyle = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const buttonStyle = (isSelected: boolean) => css`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${isSelected ? colors.blue500 : colors.grey200};
  background: ${isSelected ? colors.blue50 : colors.grey50};
  color: ${isSelected ? colors.blue600 : colors.grey700};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${isSelected ? colors.blue500 : colors.grey400};
  }
`;
