import { createSelector } from '@reduxjs/toolkit'

const selectPostsState = (state) => state.posts

export const selectAllPostIds = createSelector(
  selectPostsState,
  (posts) => posts.allIds,
)

export const selectPostById = (state, postId) => state.posts.byId[postId]

export const selectAllPosts = createSelector(
  selectPostsState,
  (posts) => posts.allIds.map((id) => posts.byId[id]),
)

export const selectDraftPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.draftStatus === 'draft'),
)

export const selectPublishedPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.draftStatus === 'published'),
)

export const selectLinkedInPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.platform === 'LinkedIn'),
)

export const selectTwitterPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.platform === 'Twitter'),
)

export const selectPostCount = createSelector(
  selectAllPosts,
  (posts) => posts.length,
)

export const selectDraftCount = createSelector(
  selectDraftPosts,
  (posts) => posts.length,
)

export const selectPublishedCount = createSelector(
  selectPublishedPosts,
  (posts) => posts.length,
)

export const selectPlatformCounts = createSelector(selectAllPosts, (posts) =>
  posts.reduce(
    (counts, post) => {
      counts[post.platform] = (counts[post.platform] ?? 0) + 1
      return counts
    },
    {
      LinkedIn: 0,
      Twitter: 0,
      Facebook: 0,
      Instagram: 0,
    },
  ),
)
