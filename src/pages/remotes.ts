// Feature components must import API functions from this path (not shared/api/remotes directly)
// to ensure test spies (vi.spyOn) intercept calls correctly via the same module identity.
export { getRooms, getReservations, createReservation, getMyReservations, cancelReservation } from 'shared/api/remotes';
