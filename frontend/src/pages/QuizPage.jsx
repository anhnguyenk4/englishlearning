import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api.js'

function formatTime(sec) {
  const s = Math.max(0, sec)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export default function QuizPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [error, setError] = useState('')

  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(300)
  const [submitted, setSubmitted] = useState(false)

  const questions = useMemo(() => quiz?.questions || [], [quiz])

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.get(`/api/quiz/${lessonId}`)
      setQuiz(res.data)
      setTimeLeft(res.data.quizDurationSec || 300)
    } catch (e) {
      setError(e?.response?.data?.message || 'Không tải được quiz')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  useEffect(() => {
    if (submitted) return
    if (!quiz) return
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [quiz, submitted])

  useEffect(() => {
    if (!quiz) return
    if (submitted) return
    if (timeLeft <= 0) {
      // Hết giờ => tự submit
      onSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted, quiz])

  const onSubmit = async () => {
    if (submitted) return
    setSubmitted(true)
    setError('')
    try {
      const res = await api.post('/api/quiz/submit', {
        lessonId,
        questionIds: questions.map((q) => q.id),
        answers,
      })
      const { score, totalQuestions, correctCount } = res.data
      alert(`Kết quả: ${score}% (đúng ${correctCount}/${totalQuestions})`)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setError(e?.response?.data?.message || 'Nộp bài thất bại')
      setSubmitted(false)
    }
  }

  if (loading) return <div className="text-sm text-slate-500 dark:text-slate-300">Đang tải quiz...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  if (!quiz) return null

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Quiz: {quiz.lesson?.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Nộp bài trước khi hết giờ.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-300">TIME LEFT</div>
          <div className="text-2xl font-black text-primary">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-primary">{idx + 1}. {q.type}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{q.prompt}</p>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-300">Question ID: {q.id}</div>
              </div>

              {q.type === 'MULTIPLE_CHOICE' ? (
                <div className="mt-4 space-y-2">
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === opt
                    return (
                      <label
                        key={i}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 ${
                          selected ? 'border-primary/40 bg-primary/5' : 'border-slate-200 dark:border-slate-700 dark:bg-slate-950'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={selected}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-200">{opt}</span>
                      </label>
                    )
                  })}
                </div>
              ) : null}

              {q.type === 'FILL_BLANK' ||
              q.type === 'WRITING' ||
              q.type === 'LISTENING' ||
              q.type === 'RANDOM' ? (
                <div className="mt-4">
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Nhập đáp án..."
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    disabled={submitted}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitted}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {submitted ? 'Đang nộp...' : 'Nộp bài'}
          </button>
          <div className="text-sm text-slate-500 dark:text-slate-300">
            Nhớ làm theo thứ tự bài học để mở khóa.
          </div>
        </div>
      </div>
    </div>
  )
}

