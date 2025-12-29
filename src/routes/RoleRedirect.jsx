import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLE_DEFAULT_ROUTES } from '../constants'

const RoleRedirect = () => {
  const { role, isAuthenticated } = useAuth()
  const destination = isAuthenticated && role ? ROLE_DEFAULT_ROUTES[role] ?? '/login' : '/login'

  return <Navigate to={destination} replace />
}

export default RoleRedirect

