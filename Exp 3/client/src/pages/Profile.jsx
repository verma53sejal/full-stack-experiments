import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import Navbar from '../components/Navbar'

function parseToken(token){ try{ return JSON.parse(atob(token.split('.')[1])) }catch(e){return null} }

export default function Profile(){
  const user = useSelector(s=>s.auth.user)
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const payload = token ? parseToken(token) : null

  const copyToken = ()=>{ navigator.clipboard.writeText(token||''); alert('Token copied') }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="card" style={{display:'flex',gap:16,alignItems:'center'}}>
          <div style={{width:96,height:96,borderRadius:48,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,var(--accent),#60a5fa)',fontWeight:700,fontSize:28}}>{user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Account Created:</strong> {new Date(user?.createdAt).toLocaleString()}</p>
            <p><strong>JWT Expiry:</strong> {payload ? new Date(payload.exp*1000).toLocaleString() : '-'}</p>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button onClick={copyToken}>Copy Token</button>
              <button onClick={()=>{dispatch(logout()); window.location.href='/login'}}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
