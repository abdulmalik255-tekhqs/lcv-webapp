import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLE_DEFAULT_ROUTES } from '../constants'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation()
  const { user, isAuthenticated, role } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    const redirect = ROLE_DEFAULT_ROUTES[role] ?? '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

