import { Navigate } from 'react-router-dom';
import { useAuth, ROLE_PORTALS } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to the user's own portal
    return <Navigate to={ROLE_PORTALS[role]} replace />;
  }

  return children;
}
