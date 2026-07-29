import { memo, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import PostForm from './PostForm.jsx'
import PostList from './PostList.jsx'
import {
  selectAllPosts,
  selectPostCount,
  selectDraftCount,
  selectPublishedCount,
  selectTwitterPosts,
  selectLinkedInPosts,
  selectInstagramPosts,
  selectFacebookPosts,
  selectFilteredSortedPosts,
} from '../features/posts/postsSelectors.js'

const platformOptions = ['All', 'Twitter', 'LinkedIn', 'Instagram', 'Facebook']
const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]
const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'platform', label: 'Platform' },
  { value: 'status', label: 'Status' },
]

const statsCards = [
  { label: 'Total Posts', icon: '🗂', field: 'total' },
  { label: 'Draft Posts', icon: '📝', field: 'draft' },
  { label: 'Published Posts', icon: '✅', field: 'published' },
  { label: 'Twitter Posts', icon: '🐦', field: 'twitter' },
  { label: 'LinkedIn Posts', icon: '💼', field: 'linkedin' },
  { label: 'Instagram Posts', icon: '📸', field: 'instagram' },
  { label: 'Facebook Posts', icon: '📘', field: 'facebook' },
]

const StatCard = memo(function StatCard({ icon, label, value }) {
  return (
    <article className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <strong className="stat-card__value">{value}</strong>
      </div>
    </article>
  )
})

function Dashboard() {
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('title')

  const allPosts = useSelector(selectAllPosts)
  const totalPosts = useSelector(selectPostCount)
  const draftCount = useSelector(selectDraftCount)
  const publishedCount = useSelector(selectPublishedCount)
  const twitterCount = useSelector(selectTwitterPosts).length
  const linkedInCount = useSelector(selectLinkedInPosts).length
  const instagramCount = useSelector(selectInstagramPosts).length
  const facebookCount = useSelector(selectFacebookPosts).length

  const filteredPostsSelector = useMemo(
    () => selectFilteredSortedPosts(searchTerm, selectedPlatform, selectedStatus, sortBy),
    [searchTerm, selectedPlatform, selectedStatus, sortBy],
  )
  const filteredPosts = useSelector(filteredPostsSelector)

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [])

  const handleEdit = useCallback((id) => {
    setSelectedId(id)
  }, [])

  const resetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedPlatform('All')
    setSelectedStatus('All')
    setSortBy('title')
  }, [])

  const cardValues = useMemo(
    () => ({
      total: totalPosts,
      draft: draftCount,
      published: publishedCount,
      twitter: twitterCount,
      linkedin: linkedInCount,
      instagram: instagramCount,
      facebook: facebookCount,
    }),
    [totalPosts, draftCount, publishedCount, twitterCount, linkedInCount, instagramCount, facebookCount],
  )

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">Experiment 1.2.1 &amp; 1.2.2</span>
          <h1>Performance-first Post Manager</h1>
          <p>Build a professional React dashboard powered by memoized selectors and optimized rendering.</p>
        </div>
      </header>

      <section className="stats-grid">
        {statsCards.map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} value={cardValues[card.field]} />
        ))}
      </section>

      <div className="main-layout">
        <aside className="form-panel">
          <PostForm key={selectedId ?? 'new'} selectedId={selectedId} onClearSelection={clearSelection} />
        </aside>

        <section className="content-panel">
          <div className="toolbar">
            <label className="filter-group">
              Search
              <input
                type="search"
                placeholder="Search titles..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <label className="filter-group">
              Platform
              <select value={selectedPlatform} onChange={(event) => setSelectedPlatform(event.target.value)}>
                {platformOptions.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-group">
              Status
              <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-group">
              Sort by
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" className="secondary reset-button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>

          <div className="posts-panel">
            <div className="posts-panel__header">
              <div>
                <h2>All Posts</h2>
                <p>{filteredPosts.length} items match current filters</p>
              </div>
            </div>

            <PostList posts={filteredPosts} onEdit={handleEdit} />
          </div>

        </section>
      </div>
    </main>
  )
}

export default memo(Dashboard)
