import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    '1': {
      id: '1',
      title: 'Launch the new profile template',
      platform: 'LinkedIn',
      draftStatus: 'published',
    },
    '2': {
      id: '2',
      title: 'Draft a social media audit guide',
      platform: 'Twitter',
      draftStatus: 'draft',
    },
  },
  allIds: ['1', '2'],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        const post = action.payload
        state.byId[post.id] = post
        state.allIds.push(post.id)
      },
      prepare({ title, platform, draftStatus }) {
        return {
          payload: {
            id: `${Date.now()}`,
            title,
            platform,
            draftStatus,
          },
        }
      },
    },
    updatePost(state, action) {
      const { id, title, platform, draftStatus } = action.payload
      if (!state.byId[id]) {
        return
      }
      state.byId[id] = {
        id,
        title,
        platform,
        draftStatus,
      }
    },
    deletePost(state, action) {
      const id = action.payload
      if (!state.byId[id]) {
        return
      }
      delete state.byId[id]
      state.allIds = state.allIds.filter((postId) => postId !== id)
    },
  },
})

export const { addPost, updatePost, deletePost } = postsSlice.actions
export default postsSlice.reducer
