import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api.js'

export default function CoursesPage() {
  const [level, setLevel] = useState('ALL')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCourses = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.get('/api/courses', level === 'ALL' ? {} : { params: { level } })
      setCourses(res.data.courses)
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được khóa học')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  const enroll = async (courseId) => {
    try {
      await api.post(`/api/courses/${courseId}/enroll`)
      await fetchCourses()
    } catch (e) {
      alert(e?.response?.data?.message || 'Enroll thất bại')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Khóa học</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Chọn level phù hợp và bắt đầu học.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="ALL">Tất cả</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="text-sm text-slate-500">Đang tải...</div> : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} onEnroll={enroll} />
        ))}
      </div>
    </div>
  )
}

function CourseCard({ course, onEnroll }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{course.level}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {course.duration} phút
            </span>
          </div>
        </div>
        <h2 className="mt-3 text-lg font-black tracking-tight text-slate-900 dark:text-white">{course.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{course.description}</p>
        <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">{course.lessonsCount} bài học</div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
        <button
          disabled={course.enrolled}
          onClick={() => onEnroll(course.id)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {course.enrolled ? 'Đã tham gia' : 'Enroll'}
        </button>
        <Link to={`/courses/${course.id}`} className="text-sm font-bold text-primary hover:underline dark:text-emerald-400">
          Xem chi tiết
        </Link>
      </div>
    </div>
  )
}

