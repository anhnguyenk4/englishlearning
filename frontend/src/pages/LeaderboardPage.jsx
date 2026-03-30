import React, { useEffect, useState } from 'react'
import { api } from '../services/api.js'

export default function LeaderboardPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/leaderboard')
      setRows(res.data.leaderboard)
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được leaderboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <div className="text-sm text-slate-500 dark:text-slate-300">Đang tải...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Bảng xếp hạng</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Điểm dựa trên tổng số quiz đã làm.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-950">
            <tr className="text-left text-sm font-bold text-slate-600 dark:text-slate-300">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Người học</th>
              <th className="px-4 py-3">Điểm</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.userId} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-300">{idx + 1}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                  {r.name || r.email}
                </td>
                <td className="px-4 py-3 text-sm font-black text-primary">{r.score}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-sm text-slate-500 dark:text-slate-300">
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

