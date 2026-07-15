import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import ScreenPage from '../components/ScreenPage';
import { adminScreens } from '../screens';

export default function AdminLayout() {
  return (
    <Routes>
      <Route
        element={
          <PortalLayout
            portalName="Super Admin"
            portalSubtitle="Admin Portal"
            portalIcon="security"
            screens={adminScreens}
            basePath="/admin"
          />
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<ScreenPage screens={adminScreens} />} />
      </Route>
    </Routes>
  );
}
