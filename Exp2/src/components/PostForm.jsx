import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost, updatePost } from '../features/posts/postsSlice.js'
import { selectPostById } from '../features/posts/postsSelectors.js'

const platforms = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram']
const draftOptions = ['draft', 'published']

function PostForm({ selectedId, onClearSelection }) {
  const dispatch = useDispatch()
    const selectedPost = useSelector((state) => selectPostById(state, selectedId))

  const [title, setTitle] = useState(() => selectedPost?.title ?? '')
  const [platform, setPlatform] = useState(() => selectedPost?.platform ?? platforms[0])
  const [draftStatus, setDraftStatus] = useState(() => selectedPost?.draftStatus ?? draftOptions[0])

  const isFormValid = title.trim().length > 0 && platform.trim().length > 0

  const submitHandler = (event) => {
    event.preventDefault()
    if (!isFormValid) {
      return
    }

    if (selectedPost) {
      dispatch(
        updatePost({
          id: selectedPost.id,
          title: title.trim(),
          platform,
          draftStatus,
        }),
      )
      onClearSelection()
    } else {
      dispatch(
        addPost({
          title: title.trim(),
          platform,
          draftStatus,
        }),
      )
      setTitle('')
      setPlatform(platforms[0])
      setDraftStatus(draftOptions[0])
    }
  }

  return (
    <section className="post-form">
      <h2>{selectedPost ? 'Edit Post' : 'Add Post'}</h2>
      <form onSubmit={submitHandler}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Post title"
          />
        </label>

        <label>
          Platform
          <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
            {platforms.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
            {draftOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={!isFormValid}>
            {selectedPost ? 'Update Post' : 'Add Post'}
          </button>
          {selectedPost && (
            <button type="button" onClick={onClearSelection} className="secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

export default memo(PostForm)
