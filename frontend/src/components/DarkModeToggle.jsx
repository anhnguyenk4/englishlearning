import React from 'react'

export default function DarkModeToggle() {
  const toggle = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      localStorage.setItem('nedu_theme', 'light')
    } else {
      html.classList.add('dark')
      localStorage.setItem('nedu_theme', 'dark')
    }
  }

  const current = typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      aria-label="Toggle dark mode"
      title="Dark mode"
    >
      <span className="material-symbols-outlined align-middle" style={{ fontVariationSettings: `'FILL' 1` }}>
        {current ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  )
}

