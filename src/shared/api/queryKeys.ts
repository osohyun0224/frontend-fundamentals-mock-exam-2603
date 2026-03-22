export const queryKeys = {
  rooms: ['rooms'] as const,
  reservations: (date: string) => ['reservations', date] as const,
  allReservations: ['reservations'] as const,
  myReservations: ['myReservations'] as const,
};
