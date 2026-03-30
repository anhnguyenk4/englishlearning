import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api.js'

export default function LessonPage() {
  const { courseId } = useParams()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.get(`/api/lessons/${courseId}`)
      setLessons(res.data.lessons)
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được bài học')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  if (loading) return <div className="text-sm text-slate-500">Đang tải...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Bài học</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Học theo thứ tự để mở khóa bài tiếp theo.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {lessons.map((l) => (
          <div
            key={l.id}
            className={`rounded-2xl border p-4 transition-colors ${
              l.unlocked
                ? 'border-slate-100 bg-white hover:border-primary/20 dark:border-slate-800 dark:bg-slate-900'
                : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-500'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-primary">{l.type}</p>
                <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{l.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {l.unlocked ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    Mở khóa
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    🔒 Khóa
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Bài {l.orderIndex + 1}
              </p>
              {l.unlocked ? (
                <Link to={`/quiz/${l.id}`} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover">
                  Làm quiz
                </Link>
              ) : (
                <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-bold text-slate-500">
                  Hoàn thành trước
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

