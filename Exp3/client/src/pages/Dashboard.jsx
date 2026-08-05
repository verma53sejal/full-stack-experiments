import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Dashboard(){
  const user = useSelector(s=>s.auth.user)
  const [stats,setStats]=useState(null)

  useEffect(()=>{
    if(user?.role === 'Admin') api.get('/admin/stats').then(r=>setStats(r.data)).catch(()=>{})
    else api.get('/posts').then(r=>setStats({ totalPosts: r.data.length }))
  },[user])

  const capabilities = user?.role === 'Admin' ? ['Create posts', 'Edit posts', 'Delete posts', 'Manage users'] : user?.role === 'Editor' ? ['Create posts', 'Edit posts'] : ['View posts']

  return <div className="app-page"><Navbar /><main className="container dashboard">
    <section className="dashboard-hero card">
      <div><p className="eyebrow">{user?.role || 'Viewer'} WORKSPACE</p><h1>Welcome back, {user?.name || 'User'}.</h1><p>Manage your team’s content with secure, role-based access.</p></div>
      <Link className="dashboard-cta" to="/posts">Open posts <span>→</span></Link>
    </section>
    <section className="dashboard-grid">
      <div className="card capability-card"><p className="eyebrow">YOUR ACCESS</p><h2>{user?.role || 'Viewer'}</h2><ul>{capabilities.map(item=><li key={item}>✓ {item}</li>)}</ul></div>
      <div className="card stats-card"><p className="eyebrow">OVERVIEW</p>{stats ? <div className="stats-grid">{Object.entries(stats).map(([key,value])=><div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><strong>{value}</strong></div>)}</div> : <p className="muted-copy">Loading your workspace…</p>}</div>
    </section>
  </main></div>
}
