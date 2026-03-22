import { Suspense } from 'react';
import { ReservationStatusPage } from 'features/reservation-status/ReservationStatusPage';
import { RoomBookingPage } from 'features/room-booking/RoomBookingPage';
import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { LoadingFallback } from 'shared/components/LoadingFallback';

export const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route
        path="/"
        element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <ReservationStatusPage />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path="/booking"
        element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <RoomBookingPage />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </ReactRouterRoutes>
  );
};
