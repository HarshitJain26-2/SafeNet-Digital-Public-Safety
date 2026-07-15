import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import ScreenPage from '../components/ScreenPage';
import { citizenScreens } from '../screens';

export default function CitizenLayout() {
  return (
    <Routes>
      <Route
        element={
          <PortalLayout
            portalName="Citizen Portal"
            portalSubtitle="Citizen Portal"
            portalIcon="shield_person"
            screens={citizenScreens}
            basePath="/citizen"
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<ScreenPage screens={citizenScreens} />} />
      </Route>
    </Routes>
  );
}
