import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import PostForm from './PostForm.jsx'
import PostList from './PostList.jsx'
import { selectAllPosts, selectPostCount } from '../features/posts/postsSelectors.js'

function Dashboard() {
  const [selectedId, setSelectedId] = useState(null)
  const allPosts = useSelector(selectAllPosts)
  const postCount = useSelector(selectPostCount)

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [])

  return (
    <main className="dashboard">
      <header>
        <h1>Full Stack Lab Experiment 1.2</h1>
        <p>Manage posts with Redux Toolkit and React Redux.</p>
      </header>

      <div className="dashboard-grid">
        <PostForm key={selectedId ?? 'new'} selectedId={selectedId} onClearSelection={clearSelection} />
        <section className="posts-panel">
          <div className="action-row">
            <h2>Existing Posts</h2>
            <p>{postCount} total posts</p>
          </div>
          <PostList />
          <div className="edit-list">
            <h3>Edit a Post</h3>
            <ul>
              {allPosts.map((post) => (
                <li key={post.id}>
                  <button type="button" onClick={() => setSelectedId(post.id)}>
                    {post.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
