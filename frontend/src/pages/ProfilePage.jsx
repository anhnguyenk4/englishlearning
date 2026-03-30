import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js'

export default function ProfilePage() {
  const apiBase = import.meta.env.VITE_API_URL || ''
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/users/profile')
      setProfile(res.data.user)
      setName(res.data.user?.name || '')
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmitProfile = async (e) => {
    e.preventDefault()
    setError('')
    const fd = new FormData()
    fd.append('name', name)
    if (avatarFile) fd.append('avatar', avatarFile)

    try {
      await api.put('/api/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await load()
      alert('Cập nhật profile thành công')
    } catch (e) {
      setError(e?.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const onSubmitPassword = async (e) => {
    e.preventDefault()
    setError('')
    setPwLoading(true)
    try {
      await api.put('/api/auth/change-password', { oldPassword, newPassword })
      setOldPassword('')
      setNewPassword('')
      alert('Đổi mật khẩu thành công')
    } catch (e) {
      setError(e?.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Cập nhật tên/ảnh đại diện và đổi mật khẩu.</p>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="text-sm text-slate-500">Đang tải...</div> : null}

      {profile ? (
        <div className="grid gap-6 md:grid-cols-2">
          <form onSubmit={onSubmitProfile} className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Thông tin người dùng</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Level hiện tại: <span className="font-bold text-primary">{profile.level}</span></p>

            <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-200">Tên</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />

            <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-200">Avatar</label>
            <input
              className="mt-2 w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />

            <div className="mt-5 flex items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover"
              >
                Lưu thay đổi
              </button>
              {profile.avatar ? (
                <img
                  alt="avatar"
                  src={profile.avatar.startsWith('/') ? `${apiBase}${profile.avatar}` : profile.avatar}
                  className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                />
              ) : null}
            </div>
          </form>

          <form onSubmit={onSubmitPassword} className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Đổi mật khẩu</h2>

            <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-200">Mật khẩu cũ</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-200">Mật khẩu mới</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={pwLoading}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {pwLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

