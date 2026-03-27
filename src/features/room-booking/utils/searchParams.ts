import { formatDate } from 'shared/utils';

export interface BookingParams {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
}

export function parseBookingSearchParams(searchParams: URLSearchParams): BookingParams {
  return {
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : [],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };
}

export function toBookingSearchParams(filters: BookingParams): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.date) params.date = filters.date;
  if (filters.startTime) params.startTime = filters.startTime;
  if (filters.endTime) params.endTime = filters.endTime;
  if (filters.attendees > 1) params.attendees = String(filters.attendees);
  if (filters.equipment.length > 0) params.equipment = filters.equipment.join(',');
  if (filters.preferredFloor !== null) params.floor = String(filters.preferredFloor);

  return params;
}
