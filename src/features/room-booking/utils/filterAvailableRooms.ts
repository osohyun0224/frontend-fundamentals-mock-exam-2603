import { Room, Reservation } from 'shared/types';

interface FilterParams {
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
  startTime: string;
  endTime: string;
  date: string;
}

function hasTimeConflict(reservation: Reservation, roomId: string, date: string, startTime: string, endTime: string): boolean {
  return reservation.roomId === roomId && reservation.date === date && reservation.start < endTime && reservation.end > startTime;
}

function meetsCapacity(room: Room, attendees: number): boolean {
  return room.capacity >= attendees;
}

function hasRequiredEquipment(room: Room, requiredEquipment: string[]): boolean {
  return requiredEquipment.every(eq => room.equipment.includes(eq as Room['equipment'][number]));
}

function matchesFloor(room: Room, preferredFloor: number | null): boolean {
  return preferredFloor === null || room.floor === preferredFloor;
}

export function filterAvailableRooms(rooms: Room[], reservations: Reservation[], filters: FilterParams): Room[] {
  return rooms
    .filter(room => {
      if (!meetsCapacity(room, filters.attendees)) return false;
      if (!hasRequiredEquipment(room, filters.equipment)) return false;
      if (!matchesFloor(room, filters.preferredFloor)) return false;
      const hasConflictingReservation = reservations.some(reservation =>
        hasTimeConflict(reservation, room.id, filters.date, filters.startTime, filters.endTime)
      );
      return !hasConflictingReservation;
    })
    .sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });
}
