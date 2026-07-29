import { createSelector } from '@reduxjs/toolkit'

export const selectPostsState = (state) => state.posts

export const selectAllPostIds = createSelector(
  selectPostsState,
  (posts) => posts.allIds,
)

export const selectPostById = createSelector(
  [selectPostsState, (_, postId) => postId],
  (posts, postId) => (postId ? posts.byId[postId] : undefined),
)

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

export const selectPostsByPlatform = (platform) =>
  createSelector(selectAllPosts, (posts) =>
    posts.filter((post) => post.platform === platform),
  )

export const selectLinkedInPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.platform === 'LinkedIn'),
)

export const selectTwitterPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.platform === 'Twitter'),
)

export const selectInstagramPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.platform === 'Instagram'),
)

export const selectFacebookPosts = createSelector(
  selectAllPosts,
  (posts) => posts.filter((post) => post.platform === 'Facebook'),
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

export const selectPostsGroupedByPlatform = createSelector(
  selectAllPosts,
  (posts) =>
    posts.reduce((groups, post) => {
      if (!groups[post.platform]) {
        groups[post.platform] = []
      }
      groups[post.platform].push(post)
      return groups
    }, {}),
)

export const selectFilteredSortedPosts = (search, platform, status, sortBy) =>
  createSelector(selectAllPosts, (posts) => {

    const normalizedSearch = (search || '').trim().toLowerCase()

    const filteredPosts = posts.filter((post) => {
      const matchesSearch = normalizedSearch
        ? post.title.toLowerCase().includes(normalizedSearch)
        : true

      const matchesPlatform = platform && platform !== 'All' ? post.platform === platform : true

      const matchesStatus =
        status && status !== 'All'
          ? status.toLowerCase() === 'draft'
            ? post.draftStatus === 'draft'
            : post.draftStatus === 'published'
          : true

      return matchesSearch && matchesPlatform && matchesStatus
    })

    return [...filteredPosts].sort((a, b) => {
      const getValue = (item) => {
        if (sortBy === 'platform') return item.platform
        if (sortBy === 'status') return item.draftStatus
        return item.title
      }

      const aValue = getValue(a).toLowerCase()
      const bValue = getValue(b).toLowerCase()
      return aValue.localeCompare(bValue)
    })
  })
