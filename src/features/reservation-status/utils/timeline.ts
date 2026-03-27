import { TOTAL_MINUTES } from 'shared/utils/constants';
import { timeToMinutes } from 'shared/utils';

export function getTimelineLeftPercent(time: string): number {
  return (timeToMinutes(time) / TOTAL_MINUTES) * 100;
}

export function getTimelineWidthPercent(startTime: string, endTime: string): number {
  return ((timeToMinutes(endTime) - timeToMinutes(startTime)) / TOTAL_MINUTES) * 100;
}
