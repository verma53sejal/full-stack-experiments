import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function RoleProtectedRoute({ children, allowed=[] }){
  const user = useSelector(s=>s.auth.user)
  if(!user) return <Navigate to="/login" />
  if(!allowed.includes(user.role)) return <Navigate to="/unauthorized" />
  return children
}
