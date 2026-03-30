import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'

const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
const LESSON_TYPES = ['VOCABULARY', 'GRAMMAR', 'LISTENING', 'READING']
const QUESTION_TYPES = ['MULTIPLE_CHOICE', 'FILL_BLANK', 'LISTENING', 'WRITING', 'RANDOM']

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [lessons, setLessons] = useState([])
  const [selectedLessonId, setSelectedLessonId] = useState('')
  const [questions, setQuestions] = useState([])

  // -------- Course form --------
  const [courseForm, setCourseForm] = useState({
    id: '',
    title: '',
    description: '',
    level: 'BEGINNER',
    duration: 30,
  })

  // -------- Lesson form --------
  const [lessonForm, setLessonForm] = useState({
    id: '',
    courseId: '',
    title: '',
    type: 'VOCABULARY',
    content: '',
    orderIndex: 0,
  })

  // -------- Question form --------
  const [questionForm, setQuestionForm] = useState({
    id: '',
    lessonId: '',
    type: 'MULTIPLE_CHOICE',
    question: '',
    optionsText: 'Option A, Option B, Option C',
    correctAnswer: '',
    orderIndex: 0,
  })

  // -------- User role form --------
  const [userRoleForm, setUserRoleForm] = useState({ id: '', role: 'USER' })

  const canLoadLessons = useMemo(() => selectedCourseId !== '', [selectedCourseId])
  const canLoadQuestions = useMemo(() => selectedLessonId !== '', [selectedLessonId])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/admin/stats')
      setStats(res.data.stats)
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được admin stats')
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async () => {
    const res = await api.get('/api/admin/courses')
    setCourses(res.data.courses || [])
    if (!selectedCourseId && (res.data.courses || []).length) setSelectedCourseId(String(res.data.courses[0].id))
  }

  const loadLessons = async (courseId) => {
    const res = await api.get(`/api/admin/lessons/${courseId}`)
    setLessons(res.data.lessons || [])
    if (!selectedLessonId && (res.data.lessons || []).length) setSelectedLessonId(String(res.data.lessons[0].id))
  }

  const loadQuestions = async (lessonId) => {
    const res = await api.get(`/api/admin/questions/${lessonId}`)
    setQuestions(res.data.questions || [])
  }

  useEffect(() => {
    load().then(() => loadCourses()).catch((e) => setError(e?.response?.data?.message || 'Lỗi admin'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!canLoadLessons) return
    loadLessons(selectedCourseId).catch((e) => setError(e?.response?.data?.message || 'Lỗi load lessons'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId])

  useEffect(() => {
    if (!canLoadQuestions) return
    loadQuestions(selectedLessonId).catch((e) => setError(e?.response?.data?.message || 'Lỗi load questions'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId])

  const parseOptions = (optionsText) => {
    return optionsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  // -------- Course CRUD --------
  const createCourse = async () => {
    setError('')
    await api.post('/api/admin/courses', {
      title: courseForm.title,
      description: courseForm.description,
      level: courseForm.level,
      duration: Number(courseForm.duration),
    })
    await loadCourses()
  }

  const updateCourse = async () => {
    if (!courseForm.id) return alert('Nhập course id để update')
    setError('')
    await api.put(`/api/admin/courses/${courseForm.id}`, {
      title: courseForm.title,
      description: courseForm.description,
      level: courseForm.level,
      duration: Number(courseForm.duration),
    })
    await loadCourses()
  }

  const deleteCourse = async (id) => {
    if (!confirm('Xóa course này?')) return
    setError('')
    await api.delete(`/api/admin/courses/${id}`)
    await loadCourses()
  }

  // -------- Lesson CRUD --------
  const createLesson = async () => {
    setError('')
    const payload = {
      courseId: lessonForm.courseId ? Number(lessonForm.courseId) : Number(selectedCourseId),
      title: lessonForm.title,
      type: lessonForm.type,
      content: lessonForm.content,
      orderIndex: Number(lessonForm.orderIndex),
    }
    await api.post('/api/admin/lessons', payload)
    await loadLessons(payload.courseId)
  }

  const updateLesson = async () => {
    if (!lessonForm.id) return alert('Nhập lesson id để update')
    setError('')
    await api.put(`/api/admin/lessons/${lessonForm.id}`, {
      title: lessonForm.title,
      type: lessonForm.type,
      content: lessonForm.content,
      orderIndex: Number(lessonForm.orderIndex),
    })
    if (lessonForm.courseId) await loadLessons(lessonForm.courseId)
  }

  const deleteLesson = async (id) => {
    if (!confirm('Xóa lesson này?')) return
    setError('')
    await api.delete(`/api/admin/lessons/${id}`)
    await loadLessons(selectedCourseId)
  }

  // -------- Question CRUD --------
  const createQuestion = async () => {
    setError('')
    const payload = {
      lessonId: questionForm.lessonId ? Number(questionForm.lessonId) : Number(selectedLessonId),
      type: questionForm.type,
      question: questionForm.question,
      options:
        questionForm.type === 'MULTIPLE_CHOICE' ? parseOptions(questionForm.optionsText) : null,
      correctAnswer: questionForm.correctAnswer,
      orderIndex: Number(questionForm.orderIndex),
    }
    await api.post('/api/admin/questions', payload)
    await loadQuestions(payload.lessonId)
  }

  const updateQuestion = async () => {
    if (!questionForm.id) return alert('Nhập question id để update')
    setError('')
    await api.put(`/api/admin/questions/${questionForm.id}`, {
      type: questionForm.type,
      question: questionForm.question,
      options:
        questionForm.type === 'MULTIPLE_CHOICE' ? parseOptions(questionForm.optionsText) : null,
      correctAnswer: questionForm.correctAnswer,
      orderIndex: Number(questionForm.orderIndex),
    })
    if (questionForm.lessonId) await loadQuestions(questionForm.lessonId)
  }

  const deleteQuestion = async (id) => {
    if (!confirm('Xóa question này?')) return
    setError('')
    await api.delete(`/api/admin/questions/${id}`)
    await loadQuestions(selectedLessonId)
  }

  const updateUserRole = async () => {
    setError('')
    if (!userRoleForm.id) return alert('Nhập user id')
    await api.patch(`/api/admin/users/${userRoleForm.id}/role`, { role: userRoleForm.role })
    alert('Đã cập nhật role')
  }

  if (loading) return <div className="text-sm text-slate-500 dark:text-slate-300">Đang tải...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  if (!stats) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">CRUD Courses/Lessons/Questions (MVP) + Dashboard stats.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tổng users" value={stats.users} />
        <StatCard title="Tổng courses" value={stats.courses} />
        <StatCard title="Tổng lessons" value={stats.lessons} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Courses */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <SectionTitle title="Courses CRUD" subtitle="Tạo/sửa/xóa khóa học." />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input label="Course ID (update/xóa)" value={courseForm.id} onChange={(v) => setCourseForm((s) => ({ ...s, id: v }))} />
            <Select
              label="Level"
              value={courseForm.level}
              options={COURSE_LEVELS}
              onChange={(v) => setCourseForm((s) => ({ ...s, level: v }))}
            />
            <Input label="Title" value={courseForm.title} onChange={(v) => setCourseForm((s) => ({ ...s, title: v }))} />
            <Input
              label="Duration (phút)"
              value={courseForm.duration}
              onChange={(v) => setCourseForm((s) => ({ ...s, duration: v }))}
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Description</label>
              <textarea
                className="mt-2 w-full min-h-24 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={courseForm.description}
                onChange={(e) => setCourseForm((s) => ({ ...s, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover" onClick={createCourse}>
              Tạo
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200" onClick={updateCourse}>
              Update
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Chọn course để quản lý lessons</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>

            <div className="mt-4 space-y-2">
              {courses.slice(0, 10).map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{c.level} - {c.duration} phút</p>
                  </div>
                  <button className="text-sm font-bold text-red-600 hover:underline" onClick={() => deleteCourse(c.id)}>
                    Xóa
                  </button>
                </div>
              ))}
              {!courses.length ? <p className="text-sm text-slate-500 dark:text-slate-300">Chưa có course.</p> : null}
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <SectionTitle title="Lessons CRUD" subtitle="Quản lý bài học theo khóa học được chọn." />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input label="Lesson ID (update/xóa)" value={lessonForm.id} onChange={(v) => setLessonForm((s) => ({ ...s, id: v }))} />
            <Select
              label="Lesson type"
              value={lessonForm.type}
              options={LESSON_TYPES}
              onChange={(v) => setLessonForm((s) => ({ ...s, type: v }))}
            />
            <Input label="Title" value={lessonForm.title} onChange={(v) => setLessonForm((s) => ({ ...s, title: v }))} />
            <Input
              label="Order index"
              value={lessonForm.orderIndex}
              onChange={(v) => setLessonForm((s) => ({ ...s, orderIndex: v }))}
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Content</label>
              <textarea
                className="mt-2 w-full min-h-20 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={lessonForm.content}
                onChange={(e) => setLessonForm((s) => ({ ...s, content: e.target.value }))}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                Nếu type là LISTENING thì content được hiểu là URL audio (MVP).
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover" onClick={createLesson}>
              Tạo lesson
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200" onClick={updateLesson}>
              Update
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Chọn lesson để quản lý questions</label>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {lessons.map((l) => (
                <option key={l.id} value={String(l.id)}>
                  {l.orderIndex + 1}. {l.title} ({l.type})
                </option>
              ))}
            </select>

            <div className="mt-4 space-y-2">
              {lessons.slice(0, 10).map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{l.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{l.type} - #{l.id}</p>
                  </div>
                  <button className="text-sm font-bold text-red-600 hover:underline" onClick={() => deleteLesson(l.id)}>
                    Xóa
                  </button>
                </div>
              ))}
              {!lessons.length ? <p className="text-sm text-slate-500 dark:text-slate-300">Chưa có lessons cho course này.</p> : null}
            </div>
          </div>
        </div>
      </div>

      {/* Questions + User role */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <SectionTitle title="Questions CRUD" subtitle="Tạo/sửa/xóa câu hỏi trong lesson đang chọn." />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input label="Question ID (update/xóa)" value={questionForm.id} onChange={(v) => setQuestionForm((s) => ({ ...s, id: v }))} />
            <Select
              label="Question type"
              value={questionForm.type}
              options={QUESTION_TYPES}
              onChange={(v) => setQuestionForm((s) => ({ ...s, type: v }))}
            />
            <Input
              label="Order index"
              value={questionForm.orderIndex}
              onChange={(v) => setQuestionForm((s) => ({ ...s, orderIndex: v }))}
            />
            <Input
              label="Correct answer"
              value={questionForm.correctAnswer}
              onChange={(v) => setQuestionForm((s) => ({ ...s, correctAnswer: v }))}
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Question prompt</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                value={questionForm.question}
                onChange={(e) => setQuestionForm((s) => ({ ...s, question: e.target.value }))}
              />
            </div>

            {questionForm.type === 'MULTIPLE_CHOICE' ? (
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Options (ngăn cách bằng dấu `,`)
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  value={questionForm.optionsText}
                  onChange={(e) => setQuestionForm((s) => ({ ...s, optionsText: e.target.value }))}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover" onClick={createQuestion}>
              Tạo question
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200" onClick={updateQuestion}>
              Update
            </button>
          </div>

          <div className="mt-6">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Danh sách questions (preview)</div>
            <div className="mt-2 space-y-2">
              {questions.slice(0, 10).map((q) => (
                <div key={q.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{q.orderIndex + 1}. {q.question}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{q.type} (id: {q.id})</p>
                    </div>
                    <button className="text-sm font-bold text-red-600 hover:underline" onClick={() => deleteQuestion(q.id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              {!questions.length ? <p className="text-sm text-slate-500 dark:text-slate-300">Chưa có questions cho lesson này.</p> : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <SectionTitle title="Manage Users (Role)" subtitle="Đổi role User/Admin (MVP)." />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input label="User ID" value={userRoleForm.id} onChange={(v) => setUserRoleForm((s) => ({ ...s, id: v }))} />
            <Select
              label="Role"
              value={userRoleForm.role}
              options={['USER', 'ADMIN']}
              onChange={(v) => setUserRoleForm((s) => ({ ...s, role: v }))}
            />
          </div>
          <button className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-hover" onClick={updateUserRole}>
            Cập nhật role
          </button>

          <div className="mt-4 text-sm text-slate-500 dark:text-slate-300">
            Lưu ý: MVP chưa có cơ chế “ban” riêng (có thể mở rộng sau bằng cột `is_banned`).
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold text-slate-500 dark:text-slate-300">{title}</p>
      <p className="mt-2 text-3xl font-black text-primary">{value}</p>
    </div>
  )
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-lg font-black text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{subtitle}</p>
    </div>
  )
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</label>
      <input
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</label>
      <select
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

