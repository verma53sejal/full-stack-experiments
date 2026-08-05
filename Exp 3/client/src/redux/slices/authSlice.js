import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')

export const login = createAsyncThunk('auth/login', async (creds, thunkAPI) => {
  const res = await api.post('/auth/login', creds)
  return res.data
})

export const register = createAsyncThunk('auth/register', async (data) => {
  const res = await api.post('/auth/register', data)
  return res.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: token || null, user: user ? JSON.parse(user) : null, loading: false, error: null },
  reducers: {
    logout(state) {
      state.token = null; state.user = null; localStorage.removeItem('token'); localStorage.removeItem('user')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.token = action.payload.token; state.user = action.payload.user; localStorage.setItem('token', action.payload.token); localStorage.setItem('user', JSON.stringify(action.payload.user)) })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
      .addCase(register.pending, state => { state.loading = true })
      .addCase(register.fulfilled, state => { state.loading = false })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
