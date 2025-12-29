import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginRequest, requestPasswordReset } from '../../api/authApi'
import { getStoredAuth, persistAuth } from '../../utils'

const storedAuth = getStoredAuth()

const initialState = {
  user: storedAuth?.user ?? null,
  token: storedAuth?.token ?? null,
  status: 'idle',
  error: null,
  lastPasswordReset: null,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginRequest(credentials)
      persistAuth(response)
      return response
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to sign in right now.')
    }
  },
)

export const requestPasswordResetToken = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      await requestPasswordReset(email)
      return email
    } catch (error) {
      return rejectWithValue(error.message ?? 'Unable to process reset request.')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
      persistAuth(null)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Incorrect email or password.'
        state.user = null
        state.token = null
      })
      .addCase(requestPasswordResetToken.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(requestPasswordResetToken.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.lastPasswordReset = {
          email: action.payload,
          timestamp: Date.now(),
        }
      })
      .addCase(requestPasswordResetToken.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Unable to find a user with that email.'
      })
  },
})

export const selectAuthState = (state) => state.auth

export const { logout } = authSlice.actions

export default authSlice.reducer

