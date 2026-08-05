import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, createPost } from '../redux/slices/postsSlice'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'

export default function Posts(){
  const dispatch = useDispatch()
  const { posts, loading } = useSelector(s=>s.posts)
  const user = useSelector(s=>s.auth.user)
  const [title,setTitle]=useState('')
  const [content,setContent]=useState('')
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState('Newest')
  const [page,setPage]=useState(1)
  const [perPage]=useState(5)
  const [confirmDelete,setConfirmDelete]=useState(null)
  const [editingPost, setEditingPost] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(()=>{ dispatch(fetchPosts()) },[dispatch])

  const submit = async (e) => { e.preventDefault(); try{ await dispatch(createPost({title,content})).unwrap(); toast.success('Post created'); setTitle(''); setContent('') }catch(err){ toast.error('Failed to create post') } }
  const confirmAndDelete = (postId)=>{ setConfirmDelete(postId) }
  const doDelete = async ()=>{
    try { await api.delete(`/posts/${confirmDelete}`); await dispatch(fetchPosts()).unwrap(); setConfirmDelete(null); toast.success('Post deleted successfully') } catch (e) { toast.error(e.response?.data?.message || 'Failed to delete post') }
  }
  const openEdit = (post) => {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditContent(post.content)
  }
  const saveEdit = async (event) => {
    event.preventDefault()
    try {
      await api.put(`/posts/${editingPost._id}`, { title: editTitle, content: editContent })
      toast.success('Post updated')
      setEditingPost(null)
      dispatch(fetchPosts())
    } catch (error) { toast.error('Failed to update post') }
  }

  return (
    <div>
      <Navbar />
      <div className="container">
      <div className="card">
        <h3>Posts</h3>
        {user?.role !== 'Viewer' && (
          <form onSubmit={submit} style={{marginBottom:16}}>
            <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
            <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required />
            <button type="submit">Create</button>
          </form>
        )}

        {loading && <p>Loading...</p>}
        <div style={{marginTop:12}}>
          {posts
            .filter(p=> p.title.toLowerCase().includes(query.toLowerCase()) || p.category?.toLowerCase().includes(query.toLowerCase()) || p.author?.name.toLowerCase().includes(query.toLowerCase()))
            .sort((a,b)=> filter==='Newest' ? new Date(b.createdAt)-new Date(a.createdAt) : new Date(a.createdAt)-new Date(b.createdAt))
            .slice((page-1)*perPage, page*perPage)
            .map(p=> (
            <div key={p._id} className="card" style={{marginBottom:12}}>
              <h4>{p.title}</h4>
              <small>By {p.author?.name} - {new Date(p.createdAt).toLocaleString()}</small>
              <p>{p.content.substring(0,200)}</p>
              <div className="post-actions">
                {user?.role !== 'Viewer' && <button className="edit-button" onClick={()=>openEdit(p)}>Edit</button>}
                {user?.role === 'Admin' && <button className="delete-post-button" onClick={()=>confirmAndDelete(p._id)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
          <input placeholder="Search title,author,category" value={query} onChange={e=>setQuery(e.target.value)} />
          <select value={filter} onChange={e=>setFilter(e.target.value)}><option>Newest</option><option>Oldest</option></select>
          <div style={{marginLeft:'auto'}}>
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
            <span style={{margin:'0 8px'}}>{page}</span>
            <button disabled={page*perPage>=posts.length} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        </div>
        {confirmDelete && <Modal title="Confirm Delete" onClose={()=>setConfirmDelete(null)}>
          <p>Are you sure you want to delete this post?</p>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button onClick={doDelete}>Yes, delete</button>
            <button onClick={()=>setConfirmDelete(null)}>Cancel</button>
          </div>
        </Modal>}
        {editingPost && <Modal title="Edit Post" onClose={()=>setEditingPost(null)}>
          <form className="modal-form" onSubmit={saveEdit}>
            <label>Title<input className="edit-input" value={editTitle} onChange={event=>setEditTitle(event.target.value)} required /></label>
            <label>Content<textarea className="edit-input" value={editContent} onChange={event=>setEditContent(event.target.value)} required /></label>
            <div className="modal-actions">
              <button className="edit-button" type="submit">Save changes</button>
              <button type="button" onClick={()=>setEditingPost(null)}>Cancel</button>
            </div>
          </form>
        </Modal>}
      </div>
    </div>
    </div>
  )
}
