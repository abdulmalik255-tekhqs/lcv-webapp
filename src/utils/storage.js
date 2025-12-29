const AUTH_STORAGE_KEY = 'liberty.auth'
const TOKEN_STORAGE_KEY = 'liberty.token'

const isBrowser = () => typeof window !== 'undefined' && window.localStorage

export const persistAuth = (payload) => {
  if (!isBrowser()) return

  if (!payload) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
  
  // Store JWT token separately for easy access
  if (payload.access_token || payload.token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, payload.access_token || payload.token)
  }
}

export const getStoredAuth = () => {
  if (!isBrowser()) return null

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Unable to parse auth storage payload', error)
    return null
  }
}

export const getStoredToken = () => {
  if (!isBrowser()) return null
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export const clearAuth = () => {
  if (!isBrowser()) return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}


