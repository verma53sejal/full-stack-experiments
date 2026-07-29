import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost } from '../features/posts/postsSlice.js'
import {
  selectAllPosts,
  selectLinkedInPosts,
  selectDraftPosts,
  selectPublishedCount,
} from '../features/posts/postsSelectors.js'

function PostList() {
  const dispatch = useDispatch()
  const allPosts = useSelector(selectAllPosts)
  const linkedInPosts = useSelector(selectLinkedInPosts)
  const draftPosts = useSelector(selectDraftPosts)
  const publishedCount = useSelector(selectPublishedCount)

  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePost(id))
    },
    [dispatch],
  )

  return (
    <section className="post-list">
      <div className="summary">
        <h2>Posts Summary</h2>
        <p>All posts: {allPosts.length}</p>
        <p>LinkedIn posts: {linkedInPosts.length}</p>
        <p>Draft posts: {draftPosts.length}</p>
        <p>Published count: {publishedCount}</p>
      </div>

      <div className="post-groups">
        <div className="group">
          <h3>All Posts</h3>
          {allPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <ul>
              {allPosts.map((post) => (
                <li key={post.id}>
                  <strong>{post.title}</strong>
                  <span>{post.platform}</span>
                  <span>{post.draftStatus}</span>
                  <button type="button" onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="group">
          <h3>LinkedIn Posts</h3>
          {linkedInPosts.length === 0 ? (
            <p>No LinkedIn posts.</p>
          ) : (
            <ul>
              {linkedInPosts.map((post) => (
                <li key={post.id}>
                  <strong>{post.title}</strong>
                  <span>{post.platform}</span>
                  <span>{post.draftStatus}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="group">
          <h3>Draft Posts</h3>
          {draftPosts.length === 0 ? (
            <p>No drafts.</p>
          ) : (
            <ul>
              {draftPosts.map((post) => (
                <li key={post.id}>
                  <strong>{post.title}</strong>
                  <span>{post.platform}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default memo(PostList)
