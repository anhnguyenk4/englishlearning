import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import { api } from '../services/api.js'

export default function RequireAuth({ children }) {
  const location = useLocation()
  const { token, user, initFromStorage, fetchProfile, loadingProfile } = useAuthStore()

  useEffect(() => {
    initFromStorage()
  }, [initFromStorage])

  useEffect(() => {
    // Nếu đã có token mà chưa có user => lấy profile
    if (token && !user) {
      fetchProfile({ api })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user])

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  if (loadingProfile && !user) return <div className="p-6">Đang tải...</div>
  if (!user) return <div className="p-6">Không tìm thấy người dùng.</div>

  return children
}

