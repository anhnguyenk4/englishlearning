import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api.js'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.get(`/api/courses/${courseId}`)
      setCourse(res.data.course)
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được khóa học')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const enroll = async () => {
    try {
      await api.post(`/api/courses/${courseId}/enroll`)
      await load()
    } catch (e) {
      alert(e?.response?.data?.message || 'Enroll thất bại')
    }
  }

  if (loading) return <div className="text-sm text-slate-500">Đang tải...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  if (!course) return null

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{course.level}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {course.duration} phút
          </span>
          {course.enrolled ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              Đã tham gia
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{course.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{course.description}</p>
        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">{course.lessonsCount} bài học</div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            disabled={course.enrolled}
            onClick={enroll}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {course.enrolled ? 'Bạn đã enrolled' : 'Enroll khóa học'}
          </button>
          <Link
            to={`/courses/${course.id}/lessons`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            Vào danh sách bài học
          </Link>
        </div>
      </div>
    </div>
  )
}

