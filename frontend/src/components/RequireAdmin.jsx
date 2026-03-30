import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import RequireAuth from './RequireAuth.jsx'

export default function RequireAdmin({ children }) {
  return (
    <RequireAuth>
      <RequireAdminInner>{children}</RequireAdminInner>
    </RequireAuth>
  )
}

function RequireAdminInner({ children }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return null
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

