import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuthStore } from '../store/authStore.js'

export default function RootLayout() {
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    const theme = localStorage.getItem('nedu_theme')
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navbar luôn hiển thị */}
      <Navbar />

      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-6 md:px-6">
        {/* Sidebar chỉ hiển thị khi đã login */}
        {token ? <Sidebar /> : <div className="hidden md:block md:w-64" />}

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

