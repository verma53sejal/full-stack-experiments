import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  const res = await api.get('/posts')
  return res.data
})

export const createPost = createAsyncThunk('posts/create', async (data) => {
  const res = await api.post('/posts', data)
  return res.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, state => { state.loading = true })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.loading = false; state.posts = action.payload })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
      .addCase(createPost.fulfilled, (state, action) => { state.posts.unshift(action.payload) })
  }
})

export default postsSlice.reducer
