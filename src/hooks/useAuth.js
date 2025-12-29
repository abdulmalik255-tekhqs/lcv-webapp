import { useMemo } from 'react'
import { getStoredAuth, clearAuth } from '../utils/storage'
import { useQueryClient } from '@tanstack/react-query'

export const useAuth = () => {
  const queryClient = useQueryClient()
  
  const authData = getStoredAuth()
  
  const user = authData?.user || null
  const token = authData?.access_token || authData?.token || null
  const role = authData?.role || null

  const actions = useMemo(
    () => ({
      logout: () => {
        clearAuth()
        queryClient.clear()
        localStorage.removeItem('app_password_verified')
        // Use window.location for navigation to avoid Router context issues
        window.location.href = '/login'
      },
    }),
    [queryClient],
  )

  return {
    user,
    token,
    role,
    isAuthenticated: !!token && !!user,
    ...actions,
  }
}

