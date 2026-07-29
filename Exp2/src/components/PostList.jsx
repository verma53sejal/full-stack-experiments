import { memo, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deletePost } from '../features/posts/postsSlice.js'
import {
  selectDraftPosts,
  selectFacebookPosts,
  selectInstagramPosts,
  selectLinkedInPosts,
  selectPublishedPosts,
  selectTwitterPosts,
} from '../features/posts/postsSelectors.js'

const PostCard = memo(function PostCard({ post, onEdit, onDelete }) {
  const handleEdit = useCallback(() => onEdit(post.id), [onEdit, post.id])
  const handleDelete = useCallback(() => onDelete(post.id), [onDelete, post.id])

  return (
    <article className="post-card">
      <div className="post-card__meta">
        <div>
          <h3>{post.title}</h3>
          <div className="badges">
            <span className={`badge badge--platform badge--${post.platform.toLowerCase()}`}>
              {post.platform}
            </span>
            <span className={`badge badge--status badge--${post.draftStatus}`}>
              {post.draftStatus}
            </span>
          </div>
        </div>
      </div>
      <div className="post-card__actions">
        <button type="button" className="secondary" onClick={handleEdit}>
          Edit
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  )
})

function PostList({ posts, onEdit }) {
  const dispatch = useDispatch()
  const twitterPosts = useSelector(selectTwitterPosts)
  const linkedInPosts = useSelector(selectLinkedInPosts)
  const instagramPosts = useSelector(selectInstagramPosts)
  const facebookPosts = useSelector(selectFacebookPosts)
  const draftPosts = useSelector(selectDraftPosts)
  const publishedPosts = useSelector(selectPublishedPosts)

  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePost(id))
    },
    [dispatch],
  )

  const sectionData = useMemo(
    () => [
      { title: 'Twitter Posts', items: twitterPosts },
      { title: 'LinkedIn Posts', items: linkedInPosts },
      { title: 'Instagram Posts', items: instagramPosts },
      { title: 'Facebook Posts', items: facebookPosts },
      { title: 'Draft Posts', items: draftPosts },
      { title: 'Published Posts', items: publishedPosts },
    ],
    [draftPosts, facebookPosts, instagramPosts, linkedInPosts, publishedPosts, twitterPosts],
  )

  const renderPostList = useCallback(
    (items) =>
      items.length === 0 ? (
        <p className="empty-state">No posts available.</p>
      ) : (
        <div className="posts-grid">
          {items.map((post) => (
            <PostCard key={post.id} post={post} onEdit={onEdit} onDelete={handleDelete} />
          ))}
        </div>
      ),
    [handleDelete, onEdit],
  )

  return (
    <div className="post-list">
      <section className="all-posts-section">
        <h2>Filtered Posts</h2>
        {renderPostList(posts)}
      </section>

      <div className="group-sections">
        {sectionData.map((section) => (
          <section key={section.title} className="group-section">
            <div className="group-section__header">
              <h3>{section.title}</h3>
              <span>{section.items.length}</span>
            </div>
            {renderPostList(section.items)}
          </section>
        ))}
      </div>
    </div>
  )
}

export default memo(PostList)
