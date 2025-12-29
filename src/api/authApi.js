import { mockHttpClient } from './client'
import { MOCK_USERS } from '../constants'

export const login = async ({ email, password }) => {
  return mockHttpClient(() => {
    const user = MOCK_USERS.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password,
    )

    if (!user) {
      const error = new Error('Invalid credentials')
      error.status = 401
      throw error
    }

    const token = btoa(`${user.id}:${Date.now()}`)

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
      },
    }
  })
}

export const requestPasswordReset = async (email) => {
  return mockHttpClient(() => {
    const exists = MOCK_USERS.some(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
    )

    if (!exists) {
      const error = new Error('Email not found')
      error.status = 404
      throw error
    }

    return { success: true }
  })
}

