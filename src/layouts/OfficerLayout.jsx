import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import ScreenPage from '../components/ScreenPage';
import { officerScreens } from '../screens';

export default function OfficerLayout() {
  return (
    <Routes>
      <Route
        element={
          <PortalLayout
            portalName="Law Enforcement"
            portalSubtitle="Officer Portal"
            portalIcon="local_police"
            screens={officerScreens}
            basePath="/officer"
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<ScreenPage screens={officerScreens} />} />
      </Route>
    </Routes>
  );
}
