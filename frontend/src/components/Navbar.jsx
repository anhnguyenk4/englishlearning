import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import DarkModeToggle from './DarkModeToggle.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hidden text-sm font-bold text-primary sm:inline-flex">
            Dashboard
          </Link>
          <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-800 sm:block" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">
            {user ? `Chào ${user.name || user.email}` : 'NEDU'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {user ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

