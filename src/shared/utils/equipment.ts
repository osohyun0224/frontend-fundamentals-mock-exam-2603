import { Equipment } from 'shared/types';
import { EQUIPMENT_LABELS } from './constants';

export function formatEquipmentList(equipmentList: Equipment[]): string {
  return equipmentList.map(equipment => EQUIPMENT_LABELS[equipment]).join(', ');
}

export function formatEquipmentListOrFallback(equipmentList: Equipment[], fallbackText: string): string {
  const equipmentText = formatEquipmentList(equipmentList);
  return equipmentText || fallbackText;
}
