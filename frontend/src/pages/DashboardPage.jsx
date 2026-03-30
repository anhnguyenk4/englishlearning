import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/progress')
      setData(res.data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chartConfig = useMemo(() => {
    const labels = (data?.history || []).map((h) => h.dateLabel)
    const scores = (data?.history || []).map((h) => h.score)
    return {
      labels,
      datasets: [
        {
          label: 'Điểm quiz',
          data: scores,
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.15)',
          tension: 0.3,
        },
      ],
    }
  }, [data])

  if (loading) return <div className="text-sm text-slate-500 dark:text-slate-300">Đang tải...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-300">Cấp độ hiện tại</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-black text-primary">{data.user?.level || 1}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Tiến bộ tăng theo số bài hoàn thành</p>
            </div>
            <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-300">Tổng bài hoàn thành</p>
              <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{data.completedLessons || 0}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-96 rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-300">Lộ trình</p>
          <div className="mt-3 space-y-4">
            {(data.enrolledCourses || []).map((c) => (
              <div key={c.courseId}>
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{c.title}</p>
                  <p className="text-sm font-black text-primary">{c.progressPercent}%</p>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full bg-primary" style={{ width: `${c.progressPercent}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  {c.completedLessons}/{c.totalLessons} lessons
                </p>
              </div>
            ))}
            {!data.enrolledCourses?.length ? <p className="text-sm text-slate-500 dark:text-slate-300">Bạn chưa enroll khóa nào.</p> : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Biểu đồ tiến độ</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Điểm số theo các lần làm quiz gần đây</p>
          </div>
        </div>
        <div className="mt-4">
          <Line data={chartConfig} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(data.badges || []).map((b) => (
              <span key={b.id} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {b.name}
              </span>
            ))}
            {!data.badges?.length ? <p className="text-sm text-slate-500 dark:text-slate-300">Chưa có badge.</p> : null}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Gợi ý</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Làm quiz ở bài học đã mở khóa để tăng level và nhận badge.
          </p>
        </div>
      </div>
    </div>
  )
}

