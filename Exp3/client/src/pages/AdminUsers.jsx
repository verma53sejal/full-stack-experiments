import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import { useSelector } from 'react-redux'

export default function AdminUsers(){
  const [users,setUsers]=useState([])

  const currentUser = useSelector(s=>s.auth.user)
  useEffect(()=>{ api.get('/users').then(r=>setUsers(r.data)).catch(()=>{}) },[])

  const changeRole = async (id,role)=>{ try{ await api.put(`/users/${id}/role`,{role}); const r = await api.get('/users'); setUsers(r.data); toast.success('Role updated') }catch(e){ toast.error('Failed to update role') } }
  const [confirmDelete,setConfirmDelete]=useState(null)
  const del = id => { setConfirmDelete(id) }
  const doDelete = async ()=>{
    if(confirmDelete===currentUser?._id){ toast.error('Cannot delete currently logged-in admin'); setConfirmDelete(null); return }
    try{ await api.delete(`/users/${confirmDelete}`); setUsers(u=>u.filter(x=>x._id!==confirmDelete)); toast.success('User deleted'); setConfirmDelete(null) }catch(e){ toast.error('Delete failed') }
  }

  return (
    <div>
      <Navbar />
      <div className="container">
      <div className="card">
        <h3>Manage Users</h3>
        <table style={{width:'100%'}}>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u=> (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <select defaultValue={u.role} onChange={e=>changeRole(u._id,e.target.value)}>
                    <option>Viewer</option>
                    <option>Editor</option>
                    <option>Admin</option>
                  </select>
                  <button onClick={()=>del(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {confirmDelete && <Modal title="Confirm Delete" onClose={()=>setConfirmDelete(null)}>
          <p>Delete this user?</p>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button onClick={doDelete}>Yes, delete</button>
            <button onClick={()=>setConfirmDelete(null)}>Cancel</button>
          </div>
        </Modal>}
      </div>
    </div>
    </div>
  )
}
