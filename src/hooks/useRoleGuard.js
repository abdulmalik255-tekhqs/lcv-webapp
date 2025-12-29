import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROLE_DEFAULT_ROUTES, USER_ROLES, ROLE_LABELS } from '../constants'
import { useAuth } from './useAuth'

export const useRoleGuard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const role = user?.role ?? null
  const isAuthenticated = Boolean(user)

  const defaultRedirect = role ? ROLE_DEFAULT_ROUTES[role] ?? '/dashboard' : '/login'

  const ensureRoleAccess = (allowedRoles) => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } })
      return false
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      navigate(defaultRedirect, {
        replace: true,
        state: { reason: 'unauthorised', required: allowedRoles.map((item) => ROLE_LABELS[item]) },
      })
      return false
    }

    return true
  }

  return useMemo(
    () => ({
      role: role ?? USER_ROLES.ADMIN,
      isAuthenticated,
      defaultRedirect,
      ensureRoleAccess,
    }),
    [role, isAuthenticated, defaultRedirect],
  )
}

