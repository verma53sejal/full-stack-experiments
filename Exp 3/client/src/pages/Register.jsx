import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { register } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

export default function Register(){
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState('')
  const [role,setRole]=useState('Viewer')
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if(password!==confirm) return toast.error('Passwords mismatch')
    try {
      await dispatch(register({name,email,password,role})).unwrap()
      toast.success('Registration successful')
      navigate('/login')
    } catch(err) { toast.error(err?.response?.data?.message || 'Registration failed') }
  }

  return <main className="auth-page"><section className="auth-card" aria-labelledby="register-title">
    <p className="auth-kicker">SECURE POST MANAGER</p>
    <h1 id="register-title">Create your account</h1>
    <p className="auth-subtitle">Choose your access level and start collaborating securely.</p>
    <form className="auth-form" onSubmit={submit}>
      <label className="field"><span>Name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" autoComplete="name" required /></label>
      <label className="field"><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
      <label className="field"><span>Password</span><span className="password-input"><input type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" required /><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
      <label className="field"><span>Confirm password</span><input type={showPassword ? 'text' : 'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password" required /></label>
      <label className="field"><span>Role</span><select value={role} onChange={e=>setRole(e.target.value)}><option value="Admin">Admin</option><option value="Editor">Editor</option><option value="Viewer">Viewer</option></select></label>
      <button className="auth-submit" type="submit">Create account <span>→</span></button>
    </form>
    <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
  </section></main>
}
