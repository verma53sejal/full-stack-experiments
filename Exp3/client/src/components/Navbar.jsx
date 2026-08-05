import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'

function parseToken(token){
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}

export default function Navbar(){
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const [remaining, setRemaining] = useState(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token) return
    const payload = parseToken(token)
    if(!payload) return
    const update = ()=>{
      const rem = payload.exp - Math.floor(Date.now()/1000)
      setRemaining(rem > 0 ? rem : 0)
      if(rem <= 0){ dispatch(logout()); navigate('/login') }
    }
    update()
    const iv = setInterval(update, 1000)
    return ()=>clearInterval(iv)
  },[dispatch, navigate])

  const toggleTheme = ()=>{
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }
  const handleLogout = ()=> { dispatch(logout()); navigate('/login') }

  return <nav className="navbar">
    <Link className="brand" to="/dashboard">Secure<span>Post</span></Link>
    <div className="nav-links">
      <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">Dashboard</Link>
      <Link className={location.pathname === '/posts' ? 'active' : ''} to="/posts">Posts</Link>
      {user?.role === 'Admin' && <Link className={location.pathname === '/admin' ? 'active' : ''} to="/admin">Manage users</Link>}
    </div>
    <div className="nav-actions">
      <div className="user-chip"><span className="user-avatar">{user?.name?.slice(0,1).toUpperCase() || 'U'}</span><span><strong>{user?.name || 'User'}</strong><small>{user?.role || 'Viewer'}</small></span></div>
      <button className="theme-button" onClick={toggleTheme} aria-label="Toggle color theme">◐ Theme</button>
      <span className="session-timer">Session {remaining !== null ? `${Math.floor(remaining/60)}m ${remaining%60}s` : '—'}</span>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  </nav>
}
