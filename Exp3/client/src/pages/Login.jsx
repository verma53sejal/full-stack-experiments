import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'
import { Navigate, Link } from 'react-router-dom'

export default function Login(){
  const dispatch = useDispatch()
  const auth = useSelector(s=>s.auth)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  if(auth.token) return <Navigate to="/dashboard" />

  const doSubmit = async (e) => {
    e.preventDefault()
    try {
      localStorage.setItem('rememberMe', String(rememberMe))
      await dispatch(login({email,password})).unwrap()
      toast.success('Login successful')
    } catch(err) { toast.error('Login failed') }
  }

  return <main className="auth-page"><section className="auth-card login-card" aria-labelledby="login-title">
    <p className="auth-kicker">SECURE POST MANAGER</p>
    <h1 id="login-title">Welcome back</h1>
    <p className="auth-subtitle">Log in to manage your team’s content safely.</p>
    <form className="auth-form" onSubmit={doSubmit}>
      <label className="field"><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
      <label className="field"><span>Password</span><span className="password-input"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required /><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
      <label className="remember"><input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} /> <span>Remember me on this device</span></label>
      <button className="auth-submit" type="submit">Log in <span>→</span></button>
    </form>
    <p className="auth-footer">Don’t have an account? <Link to="/register">Create one</Link></p>
  </section></main>
}
