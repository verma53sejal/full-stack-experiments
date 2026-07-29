import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost, updatePost } from '../features/posts/postsSlice.js'
import { selectPostById } from '../features/posts/postsSelectors.js'

const platforms = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook']
const draftOptions = ['draft', 'published']

function PostForm({ selectedId, onClearSelection }) {
  const dispatch = useDispatch()
  const selectedPost = useSelector((state) => selectPostById(state, selectedId))

  const [title, setTitle] = useState(() => selectedPost?.title ?? '')
  const [platform, setPlatform] = useState(() => selectedPost?.platform ?? platforms[0])
  const [draftStatus, setDraftStatus] = useState(() => selectedPost?.draftStatus ?? draftOptions[0])

  useEffect(() => {
    setTitle(selectedPost?.title ?? '')
    setPlatform(selectedPost?.platform ?? platforms[0])
    setDraftStatus(selectedPost?.draftStatus ?? draftOptions[0])
  }, [selectedPost])

  const isFormValid = title.trim().length > 0 && platform.trim().length > 0

  const resetForm = useCallback(() => {
    setTitle('')
    setPlatform(platforms[0])
    setDraftStatus(draftOptions[0])
    if (selectedPost) {
      onClearSelection()
    }
  }, [onClearSelection, selectedPost])

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
      <div className="form-header">
        <div>
          <span className="eyebrow">Add Post</span>
          <h2>{selectedPost ? 'Edit Post' : 'Create Post'}</h2>
        </div>
      </div>

      <form onSubmit={submitHandler}>
        <label className="field-group">
          <span>Post Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a title"
          />
        </label>

        <label className="field-group">
          <span>Platform</span>
          <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
            {platforms.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span>Status</span>
          <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
            {draftOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={!isFormValid}>
            {selectedPost ? 'Update Post' : 'Add Post'}
          </button>
          <button type="button" className="secondary" onClick={resetForm}>
            Reset Form
          </button>
          {selectedPost && (
            <button type="button" className="secondary" onClick={onClearSelection}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

export default memo(PostForm)
