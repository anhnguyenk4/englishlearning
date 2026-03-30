import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'

const linkClass = ({ isActive }) =>
  isActive
    ? 'bg-primary/10 text-primary'
    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)

  return (
    <aside className="hidden h-[calc(100vh-0px)] w-64 shrink-0 border-r border-slate-100 bg-white/70 backdrop-blur-md md:block dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-primary">NEDU</p>
            {user ? <p className="text-xs text-slate-500 dark:text-slate-400">{user.name || user.email}</p> : null}
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-semibold ${
                isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined mr-2 align-middle text-base">home</span>
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold ${linkClass({ isActive })}`}
          >
            <span className="material-symbols-outlined mr-2 align-middle text-base">book</span>
            Courses
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold ${linkClass({ isActive })}`}
          >
            <span className="material-symbols-outlined mr-2 align-middle text-base">monitoring</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold ${linkClass({ isActive })}`}
          >
            <span className="material-symbols-outlined mr-2 align-middle text-base">person</span>
            Profile
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold ${linkClass({ isActive })}`}
          >
            <span className="material-symbols-outlined mr-2 align-middle text-base">social_leaderboard</span>
            Leaderboard
          </NavLink>

          {user?.role === 'ADMIN' ? (
            <NavLink
              to="/admin"
              className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-semibold ${linkClass({ isActive })}`}
            >
              <span className="material-symbols-outlined mr-2 align-middle text-base">admin_panel_settings</span>
              Admin
            </NavLink>
          ) : null}
        </nav>
      </div>
    </aside>
  )
}

