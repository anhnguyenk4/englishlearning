import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api.js'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/auth/register', { email, password, name })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
      <div className="flex-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Đăng ký</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-300">Bắt đầu lộ trình của bạn ngay hôm nay.</p>
      </div>

      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Tên (tuỳ chọn)</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />

        <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-200">Email</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-200">Mật khẩu</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-200">Xác nhận mật khẩu</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          type="password"
          required
        />

        {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </button>

        <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-300">
          Đã có tài khoản?{' '}
          <Link className="font-bold text-primary hover:underline" to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}

